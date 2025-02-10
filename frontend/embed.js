// Simple embed script (added to your website)
(function() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://your-domain.com/chatbot.html';
  iframe.style = 'position: fixed; bottom: 20px; right: 20px; width: 350px; height: 500px; border: none; display: none;';
  
  const toggleButton = document.createElement('div');
  toggleButton.innerHTML = '💬';
  toggleButton.style = 'position: fixed; bottom: 20px; right: 20px; cursor: pointer; z-index: 9999;';

  toggleButton.addEventListener('click', () => {
    iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
  });

  document.body.appendChild(iframe);
  document.body.appendChild(toggleButton);
})();
