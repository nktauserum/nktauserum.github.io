<script lang="ts">
  import type { Post } from '$lib/types/Post';

  const posts: Post[] = [
  {
    uuid: '5ded6dea-5190-4cd6-8867-4a912a3c9564',
    created_at: '2024-11-12T09:15:00Z',
    title: 'Почему следует использовать Go для веб-разработки?',
    description: `Представьте веб-сервис, который обрабатывает тысячи запросов в секунду и не трясётся от простоя. Go создан именно для таких задач: его горутины стоят копейки, а компиляция в нативный бинарник даёт сверхнизкие задержки. Это не просто язык — это инженерный инструмент для масштабируемых и надёжных микросервисов.`,
    body: `Go прекрасно подходит для создания микросервисов благодаря:
- Легковесным goroutНеобходимо добавить пагинацию для старine и channel для координации конкурентных задач.
- Встроенному профилировщику и инструментам диагностики.
- Статически скомпилированным бинарникам, которые не требуют внешних зависимостей.

Реальный пример: команда Google Photos на Go снизила время отклика API на 30%, а затраты на инфраструктуру — на 20%.`,
    tags: ['Go', 'микросервисы', 'производительность', 'конкурентность']
  },
  {
    uuid: 'a47fbb32-2a58-4c3d-9b7f-1ddc9a661c27',
    created_at: '2025-01-08T14:30:00Z',
    title: 'Что нового в SvelteKit v1.0?',
    description: `SvelteKit v1.0 ощущается словно новое дыхание в Svelte-экосистеме: маршруты по файловой структуре, автоматическое разбиение кода и адаптеры под все популярные платформы. Забудьте о конфигурации — всё работает из коробки, а ваш проект остаётся предсказуемо лёгким.`,
    body: `Ключевые улучшения:
1. Адаптеры: официальные коннекторы для Vercel, Netlify, Cloudflare и других.
2. Полноценная SSR/SSG с гибридной стратегией рендера на одном маршруте.
3. Новые хуки load и actions с строгой TypeScript-типизацией.

Пример: вы обрабатываете форму на сервере без добавления клиентского кода — и при этом каждое действие типизировано и защищено от XSS.`,
    tags: ['SvelteKit', 'TypeScript', 'SSR', 'SSG', 'веб-фреймворки']
  },
  {
    uuid: 'd3f8c583-8f4e-4f2e-bc1e-6f8a9f19a4b5',
    created_at: '2024-09-20T18:45:00Z',
    title: 'Преимущества GraphQL перед REST',
    description: `Представьте, что у вас одна точка входа для всех данных, а клиент сам выбирает, что ему нужно. GraphQL устраняет лишние запросы и переизбыток полей, превращая API в гибкий мотор данных. Это не просто запросы — это контракт между фронтендом и бэкендом, который растёт вместе с проектом.`,
    body: `Почему выбирают GraphQL:
- Фокус на запросах: клиент получает только необходимые поля, без перегрузки.
- Схема как документ: авто-документация и валидация в одном файле.
- Поддержка подписок для реального времени.

Но помните: кэширование становится сложнее, и первоначальная настройка сервера требует продуманного дизайна схемы.`,
    tags: ['GraphQL', 'API', 'REST', 'документация', 'подписки']
  },
  {
    uuid: 'f9e1c7b4-3b5a-4139-9c3d-2a0efa7fd5ce',
    created_at: '2025-03-15T11:20:00Z',
    title: 'Как оценить производительность вашего Node.js-приложения?',
    description: `Ваше приложение работает, но вы не уверены, в чём узкие места? Сочетание встроенного инспектора V8, модуля perf_hooks и внешних инструментов, таких как Clinic.js, поможет вам увидеть «горячие» функции и спрятанные задержки. Это не просто цифры — это дорожная карта к более быстрому коду.`,
    body: `Шаги для глубокого анализа:
1. Запустите \`node --inspect app.js\` и подключитесь через Chrome DevTools для CPU-профайлинга.
2. Используйте perf_hooks для измерения Latency и Throughput в реальном времени.
3. Прогоните Clinic.js, чтобы получить flame graph и выявить узкие места.

После анализа вы сможете вынести тяжёлые вычисления в воркеры или оптимизировать алгоритмы для снижения задержек.`,
    tags: ['Node.js', 'производительность', 'профилирование', 'V8', 'Clinic.js']
  }
];

</script>

<div class="list">
  {#each posts as post}
    <div class="list__item">
        <a href="/article/{post.uuid}" class="title">
            {post.title}
        </a>

        <p class="description">{post.description}</p>

        <div class="meta">
          <span class="date">{
          new Date(post.created_at).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>

        <div class="tags">
            {#each post.tags as tag}
            <span class="tag">
                <a href="/search?tag={tag}">
                    { tag }
                </a>
            </span>
            {/each}
        </div>

    </div>
  {/each}
</div>

<style>
    .list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin: 1rem 0;
    }

    .list__item {
        padding: 1.25rem;
        border-radius: 6px;
        transition: box-shadow 0.3s;
    }

    .list__item:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .meta {
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }

    .title {
        color: var(--link);
        font-weight: 800;
        font-size: 1.75rem;
        text-decoration: none;
    }

    .title:hover {
        text-decoration: underline;
    }

    .description {
        margin: 0.5rem 0;
        color: var(--text-secondary);
        line-height: 1.5;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.75rem;
    }

    .tag {
        position: relative;
        padding: 0.5rem 1rem;
        color: var(--tag-color);
        background: var(--tag-bg);
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .tag:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }
</style>
