/**
 * Lógica principal para o Classificador de Triângulos vs Cubos
 * Utiliza o Teachable Machine Image Classification (TensorFlow.js)
 */

// Elementos da DOM
const modelUrlInput = document.getElementById('model-url');
const loadBtn = document.getElementById('load-btn');
const statusMsg = document.getElementById('model-status');

const interactiveArea = document.getElementById('interactive-area');
const resultsArea = document.getElementById('results-area');
const labelContainer = document.getElementById('label-container');

// Câmera
const webcamContainer = document.getElementById('webcam-container');
const startWebcamBtn = document.getElementById('start-webcam-btn');
const stopWebcamBtn = document.getElementById('stop-webcam-btn');
const webcamPlaceholder = document.getElementById('webcam-placeholder');

// Upload
const imageUploadInput = document.getElementById('image-upload');
const uploadedImage = document.getElementById('uploaded-image');
const uploadPlaceholder = document.getElementById('upload-placeholder');

// Variáveis Globais de Estado
let model, webcam, maxPredictions, isWebcamRunning = false;
let animationId; // Para poder cancelar o loop da webcam

// 1. Inicialização e Carregamento do Modelo
window.addEventListener('DOMContentLoaded', () => {
    // Tenta carregar a URL salva no localStorage
    const savedUrl = localStorage.getItem('tmModelUrl');
    if (savedUrl) {
        modelUrlInput.value = savedUrl;
    }
    
    // Auto-carregar o modelo se o campo tiver valor (seja do localStorage ou do HTML value)
    if (modelUrlInput.value.trim().length > 10) {
        loadBtn.click();
    }
});

function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = `status-msg ${type}`;
    statusMsg.classList.remove('hidden');
}

loadBtn.addEventListener('click', async () => {
    let url = modelUrlInput.value.trim();
    if (!url) {
        showStatus('Por favor, insira a URL do modelo.', 'error');
        return;
    }
    
    // Garante que a URL termine com "/"
    if (!url.endsWith('/')) {
        url += '/';
    }

    showStatus('Carregando modelo... Aguarde.', 'loading');
    loadBtn.disabled = true;

    try {
        const modelURL = url + 'model.json';
        const metadataURL = url + 'metadata.json';

        // Carrega o modelo de visão customizado feito no Teachable Machine
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Salva com sucesso
        localStorage.setItem('tmModelUrl', url);
        showStatus('Modelo carregado com sucesso!', 'success');
        
        // Exibe áreas de interação
        interactiveArea.classList.remove('hidden');
        resultsArea.classList.remove('hidden');

        // Prepara as barras de progresso baseadas nas classes
        setupLabelContainer();

    } catch (error) {
        console.error("Erro ao carregar o modelo:", error);
        showStatus('Erro ao carregar o modelo. Verifique a URL e tente novamente.', 'error');
    } finally {
        loadBtn.disabled = false;
    }
});

// Setup visual das classes
function setupLabelContainer() {
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        div.className = "prediction-item";
        div.innerHTML = `
            <div class="prediction-header">
                <span class="class-name">Carregando Classe...</span>
                <span class="class-probability">0%</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" id="bar-${i}"></div>
            </div>
        `;
        labelContainer.appendChild(div);
    }
}

// 2. Lógica da Webcam
startWebcamBtn.addEventListener('click', async () => {
    if (!model) return;
    
    // Desabilita preview de imagem ao usar webcam
    uploadedImage.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
    
    try {
        const flip = true; 
        webcam = new tmImage.Webcam(300, 300, flip); // largura, altura, espelhado
        await webcam.setup(); 
        await webcam.play();
        isWebcamRunning = true;

        webcamPlaceholder.style.display = 'none';
        webcamContainer.innerHTML = ''; // Limpa o container
        webcamContainer.appendChild(webcam.canvas);

        startWebcamBtn.classList.add('hidden');
        stopWebcamBtn.classList.remove('hidden');

        // Inicia o Loop de predição
        window.requestAnimationFrame(loop);

    } catch (err) {
        console.error(err);
        alert("Erro ao acessar a webcam. Verifique as permissões.");
    }
});

stopWebcamBtn.addEventListener('click', () => {
    if (webcam && isWebcamRunning) {
        webcam.stop();
        isWebcamRunning = false;
        cancelAnimationFrame(animationId);
        
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(webcamPlaceholder);
        webcamPlaceholder.style.display = 'block';
        webcamPlaceholder.innerHTML = 'Câmera parada';

        startWebcamBtn.classList.remove('hidden');
        stopWebcamBtn.classList.add('hidden');
    }
});

async function loop() {
    if (isWebcamRunning) {
        webcam.update(); 
        await predict(webcam.canvas);
        animationId = window.requestAnimationFrame(loop);
    }
}

// 3. Lógica de Upload de Imagem
imageUploadInput.addEventListener('change', (e) => {
    if (!model) {
        alert("Carregue o modelo primeiro!");
        return;
    }
    
    // Se a webcam estiver rodando, vamos parar para dar foco à imagem
    if (isWebcamRunning) {
        stopWebcamBtn.click();
    }

    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            uploadedImage.src = event.target.result;
            uploadedImage.style.display = 'block';
            uploadPlaceholder.style.display = 'none';

            // Aguarda a imagem carregar na DOM para fazer a predição
            uploadedImage.onload = async () => {
                await predict(uploadedImage);
            }
        }
        reader.readAsDataURL(file);
    }
});

// 4. Predição e Atualização da UI
async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    
    // Atualiza barras de progresso
    for (let i = 0; i < maxPredictions; i++) {
        const prob = Math.round(prediction[i].probability * 100);
        const className = prediction[i].className;
        
        const predictionItem = labelContainer.childNodes[i];
        
        // Em atualizações rápidas, checar se a label e div existem
        if(predictionItem && predictionItem.querySelector) {
            predictionItem.querySelector('.class-name').innerText = className;
            predictionItem.querySelector('.class-probability').innerText = prob + '%';
            
            const bar = document.getElementById(`bar-${i}`);
            if(bar) {
                bar.style.width = prob + '%';
                
                // Muda a cor dependo da probabilidade (Feedback visual)
                if(prob > 75) {
                    bar.style.background = 'linear-gradient(90deg, #10b981, #34d399)'; // Verde
                } else if (prob > 30) {
                    bar.style.background = 'linear-gradient(90deg, var(--primary), #818cf8)'; // Azul
                } else {
                    bar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)'; // Vermelho
                }
            }
        }
    }
}
