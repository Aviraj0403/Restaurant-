if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swPath = '/service-worker.js'; // Ensure this path is correct
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('ServiceWorker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
  