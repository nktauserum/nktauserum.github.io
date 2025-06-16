const form       = document.getElementById('send');
const fileBtn    = document.getElementById('file_btn');
const fileInput  = document.getElementById('file');
const fileNameEl = document.getElementById('filename');
const clearBtn   = document.getElementById('clear_btn');

const base_api_path = 'http://localhost:4344/message';

// Нажатие на иконку «прикрепить файл»
fileBtn.addEventListener('click', e => {
    fileInput.click();
});

// Когда файл выбран — показываем имя и кнопку очистки
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        fileNameEl.textContent = fileInput.files[0].name;
        clearBtn.style.display  = 'inline-block';
    } else {
        // если пользователь отменил выбор
        fileNameEl.textContent = '';
        clearBtn.style.display  = 'none';
    }
});

// Сброс выбора
clearBtn.addEventListener('click', () => {
    fileInput.value        = '';
    fileNameEl.textContent = '';
    clearBtn.style.display = 'none';
});

// Отправка формы
form.addEventListener('submit', async e => {
    e.preventDefault();

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
        clearBtn.click();
    } catch (err) {
        console.error(err);
        alert('Произошла ошибка при отправке: ' + err.message);
    }
});