<script lang="ts">
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let error: string | null = null;

  async function login() {
    error = null;
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error('Login failed');
      goto('/admin');
    } catch (e: any) {
      error = e.message;
    }
  }
</script>

<svelte:head>
  <title>Войти в админку</title>
</svelte:head>

<div class="container send-container">
  <form on:submit|preventDefault={login}>
    <h1>Вход</h1>
    <input
      bind:value={username}
      placeholder="Username"
      required
    />
    <input
      type="password"
      bind:value={password}
      placeholder="Password"
      required
    />
    <button type="submit">Войти</button>
    {#if error}
      <p class="error" style="color:red">{error}</p>
    {/if}
  </form>
</div>


<style>
  .container.send-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    padding: 20px;
    box-sizing: border-box;
  }

  form {
    background: #303030;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 320px;
    box-sizing: border-box;
    text-align: center;
  }

  h1 {
    margin-bottom: 24px;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    font-size: 24px;
    color: #FFFFFF;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 16px;
    border: 1px solid #22221d;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }

  button {
    width: 100%;
    padding: 12px 16px;
    background-color: var(--link);
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: var(--link-secondary);
  }

  p.error {
    margin-top: 12px;
    font-size: 14px;
  }

</style>