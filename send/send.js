const form       = document.getElementById('send');
const fileBtn    = document.getElementById('file_btn');
const fileInput  = document.getElementById('file');
const fileNameEl = document.getElementById('filename');
const clearBtn   = document.getElementById('clear_btn');
const previewBox   = document.querySelector('.preview-container');
const imgPreviewEl = document.getElementById('img_preview');
const sendButton = document.getElementById('send-button');

const base_api_path = 'http://46.8.233.74:4344/message';

fileBtn.addEventListener('click', e => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];

    if (file) {
        fileNameEl.textContent = file.name;
        clearBtn.style.display  = 'inline-block';

        const objectUrl = URL.createObjectURL(file);
        imgPreviewEl.src = objectUrl;
        previewBox.style.display = 'block';

        imgPreviewEl.onload = () => {
            URL.revokeObjectURL(objectUrl);
        };
    } else {
        fileNameEl.textContent = '';
        clearBtn.style.display   = 'none';
        previewBox.style.display = 'none';
        imgPreviewEl.src         = '';
    }
});

clearBtn.addEventListener('click', () => {
    fileInput.value        = '';
    fileNameEl.textContent = '';
    clearBtn.style.display = 'none';
    previewBox.style.display = 'none';
    imgPreviewEl.src = '';
});

// Отправка формы
form.addEventListener('submit', async e => {
    e.preventDefault();
    sendButton.disabled = true;
    sendButton.textContent = 'sending...'
    clearBtn.disabled = true;

    // Собираем данные
    const formData = new FormData(form);
    const message  = formData.get('message').trim();
    const file     = formData.get('file');

    // Простейшая валидация
    if (!message && (!file || !file.name)) {
        alert('Введите сообщение или прикрепите файл.');
        return;
    }

    try {
        // Отправляем
        const response = await fetch(base_api_path, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const result = await response.json();

            alert('Ошибка от сервера: ' + (result.error || 'Unknown'));
        }

        //alert('Сообщение успешно отправлено!');
        form.reset();
        clearBtn.disabled = false;
        clearBtn.click();
    } catch (err) {
        console.error(err);
        alert('Произошла ошибка при отправке: ' + err.message);
    } finally {
        sendButton.textContent = 'send'
        sendButton.disabled = false;
        clearBtn.disabled = false;
    }
});