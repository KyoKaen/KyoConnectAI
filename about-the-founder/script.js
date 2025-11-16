<!-- ====== JavaScript ====== -->
  // Get DOM elements
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const messagesDiv = document.getElementById("messages");
  const sendBtn = document.getElementById("send-btn");

  // Append a message bubble
  function appendMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.classList.add("message", isUser ? "user" : "ai");
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Add typing indicator
  function showTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.innerHTML = `
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    `;
    typingIndicator.setAttribute("id", "typing-indicator");
    messagesDiv.appendChild(typingIndicator);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Send user message to backend
  async function sendMessage(text) {
    sendBtn.disabled = true;
    input.disabled = true;
    showTypingIndicator(); // Show typing indicator

    try {
      const res = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      removeTypingIndicator(); // Remove typing indicator
      if (!res.ok) {
        appendMessage("⚠️ 500 Internal error。", false);
      } else {
        appendMessage(data.reply || "(no response)", false);
      }
    } catch (err) {
      console.error(err);
      removeTypingIndicator(); // Remove typing indicator
      appendMessage("⚠️ Network error occured。", false);
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  // Handle form submit
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, true);
    input.value = "";
    sendMessage(text);
  });

  // Allow Enter to send, Shift+Enter for newline
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });
