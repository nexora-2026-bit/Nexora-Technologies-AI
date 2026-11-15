
// ==========================================
// NEXORA AI - MAIN SYSTEM
// NEXORA TECHNOLOGIES
// ==========================================

// STORAGE SYSTEM

const getStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

let memories = getStorage("nexora_memories", []);

let conversations = getStorage("nexora_conversations", []);

let knowledge = getStorage("nexora_knowledge", [
  {
    question: "What is NEXORA AI?",
    answer: "NEXORA AI is an artificial intelligence project developed under NEXORA TECHNOLOGIES. It is the mind of the NEXORA ecosystem. NEXORA ROBOTICS is the body: the physical machines and robots."
  },
  {
    question: "What is artificial intelligence?",
    answer: "Artificial Intelligence, also called AI, is technology that enables computers and machines to perform tasks that normally require human intelligence, such as learning, problem-solving and understanding language."
  },
  {
    question: "What is mathematics?",
    answer: "Mathematics is the study of numbers, quantities, shapes, patterns and relationships. It includes arithmetic, algebra, geometry, statistics and more."
  },
  {
    question: "What is algebra?",
    answer: "Algebra is a branch of mathematics that uses letters and symbols to represent unknown numbers. For example, in x + 5 = 10, x represents an unknown number. Therefore, x = 5."
  },
  {
    question: "What is English language?",
    answer: "English is a language used for communication. It includes grammar, vocabulary, comprehension, oral English, writing and literature."
  },
  {
    question: "What is science?",
    answer: "Science is the systematic study of the natural world through observation, experiments and evidence."
  },
  {
    question: "Who created you?",
    answer: "I am NEXORA AI, an assistant project being developed under NEXORA TECHNOLOGIES."
  },
  {
    question: "Who is Shekinah Gotau?",
    answer: "Shekinah Gotau is the name associated with the NEXORA TECHNOLOGIES project."
  },
  {
    question: "What is your purpose?",
    answer: "My purpose is to assist people, answer questions, support learning and become a more capable intelligent system as NEXORA AI develops."
  }
]);

let settings = getStorage("nexora_settings", {
  voiceGender: "female",
  speechEnabled: true,
  conversationMemory: true
});

let currentConversation = [];

function saveData() {
  localStorage.setItem("nexora_memories", JSON.stringify(memories));
  localStorage.setItem("nexora_knowledge", JSON.stringify(knowledge));
  localStorage.setItem("nexora_settings", JSON.stringify(settings));

  if (settings.conversationMemory) {
    localStorage.setItem(
      "nexora_conversations",
      JSON.stringify(conversations)
    );
  }
}

// ==========================================
// NAVIGATION
// ==========================================

const pages = {
  chat: ["chatPage", "AI Assistant", "Your intelligent companion"],
  memory: ["memoryPage", "Memory Base", "Your saved memories"],
  knowledge: ["knowledgePage", "Knowledge Base", "Programmed AI knowledge"],
  settings: ["settingsPage", "Settings", "Configure your AI"]
};

function showPage(name) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.remove("active");
  });

  document.getElementById(pages[name][0]).classList.add("active");

  const nav = document.querySelector(`[data-page="${name}"]`);

  if (nav) nav.classList.add("active");

  document.getElementById("pageTitle").textContent = pages[name][1];

  document.getElementById("pageSubtitle").textContent = pages[name][2];

  if (name === "memory") renderMemories();

  if (name === "knowledge") renderKnowledge();
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

// ==========================================
// CHAT SYSTEM
// ==========================================

const chatArea = document.getElementById("chatArea");

const messageInput = document.getElementById("messageInput");

const welcome = document.getElementById("welcome");

function addMessage(message, sender) {
  if (welcome) welcome.style.display = "none";

  const container = document.createElement("div");

  container.className = `message ${sender}`;

  if (sender === "ai") {
    const icon = document.createElement("div");

    icon.className = "message-icon";

    icon.textContent = "N";

    container.appendChild(icon);
  }

  const bubble = document.createElement("div");

  bubble.className = "message-bubble";

  bubble.textContent = message;

  container.appendChild(bubble);

  chatArea.appendChild(container);

  chatArea.scrollTop = chatArea.scrollHeight;
}

function normalize(text) {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, "");
}

// ==========================================
// RESPONSE ENGINE
// ==========================================

function getAIResponse(question) {
  const q = normalize(question);

  let bestMatch = null;

  let bestScore = 0;

  for (const item of knowledge) {
    const key = normalize(item.question);

    const words = key.split(/\s+/).filter(word => word.length > 2);

    let score = 0;

    if (q === key) {
      score = 100;
    } else {
      words.forEach(word => {
        if (q.includes(word)) score++;
      });

      if (key.includes(q) && q.length > 3) score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return bestMatch.answer;
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(q)) {
    return "Hello! I am NEXORA AI. It is good to communicate with you. How can I assist you today?";
  }

  if (q.includes("your name")) {
    return "My name is NEXORA AI, your intelligent assistant.";
  }

  if (q.includes("how are you")) {
    return "I am operational and ready to assist you!";
  }

  if (q.includes("thank")) {
    return "You are welcome! I am always ready to help.";
  }

  if (q.includes("teach me")) {
    return "I would be happy to teach you! Tell me the subject and specific topic you want to learn.";
  }

  if (q.includes("remember")) {
    return "You can save something in my Memory Base by opening the Memory Base section and adding a new memory.";
  }

  if (q.includes("time") || q.includes("date")) {
    return "The current date and time on your computer is " + new Date().toLocaleString() + ".";
  }

  return "I do not have a programmed answer for that question yet. You can teach me the answer by opening my Knowledge Base and adding that question and its answer. My knowledge will grow as you program it.";
}

// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {
  const question = messageInput.value.trim();

  if (!question) return;

  addMessage(question, "user");

  currentConversation.push({
    sender: "user",
    text: question
  });

  messageInput.value = "";

  const answer = getAIResponse(question);

  setTimeout(() => {
    addMessage(answer, "ai");

    currentConversation.push({
      sender: "ai",
      text: answer
    });

    conversations.push({
      date: new Date().toISOString(),
      question,
      answer
    });

    saveData();

    if (settings.speechEnabled) {
      speak(answer);
    }

  }, 350);
}

document.getElementById("sendButton").addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", event => {
  if (event.key === "Enter") sendMessage();
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    messageInput.value = button.dataset.question;
    sendMessage();
  });
});

// ==========================================
// NEW CONVERSATION
// ==========================================

document.getElementById("newChat").addEventListener("click", () => {
  if (currentConversation.length) {
    conversations.push({
      date: new Date().toISOString(),
      messages: currentConversation
    });

    saveData();
  }

  currentConversation = [];

  chatArea.innerHTML = "";

  chatArea.appendChild(welcome);

  welcome.style.display = "block";

  showPage("chat");
});

// ==========================================
// MEMORY BASE
// ==========================================

function renderMemories() {
  const list = document.getElementById("memoryList");

  const count = document.getElementById("memoryCount");

  count.textContent = `${memories.length} MEMORIES`;

  list.innerHTML = "";

  if (!memories.length) {
    list.innerHTML = '<p class="empty-state">No memories saved yet. Add your first memory above.</p>';
    return;
  }

  memories.forEach((memory, index) => {
    const item = document.createElement("div");

    item.className = "memory-item";

    const text = document.createElement("p");

    text.textContent = memory.text;

    const button = document.createElement("button");

    button.className = "delete-button";

    button.textContent = "DELETE";

    button.addEventListener("click", () => {
      memories.splice(index, 1);

      saveData();

      renderMemories();
    });

    item.append(text, button);

    list.appendChild(item);
  });
}

document.getElementById("saveMemory").addEventListener("click", () => {
  const input = document.getElementById("memoryInput");

  const text = input.value.trim();

  if (!text) {
    alert("Please enter something to remember.");
    return;
  }

  memories.push({
    text,
    date: new Date().toISOString()
  });

  saveData();

  input.value = "";

  renderMemories();

  alert("Memory saved successfully!");
});

// ==========================================
// KNOWLEDGE BASE
// ==========================================

function renderKnowledge() {
  const list = document.getElementById("knowledgeList");

  list.innerHTML = "";

  knowledge.forEach((item, index) => {
    const card = document.createElement("div");

    card.className = "knowledge-item";

    const details = document.createElement("div");

    const question = document.createElement("strong");

    question.textContent = item.question;

    const answer = document.createElement("p");

    answer.textContent = item.answer;

    details.append(question, answer);

    const remove = document.createElement("button");

    remove.className = "delete-button";

    remove.textContent = "DELETE";

    remove.addEventListener("click", () => {
      knowledge.splice(index, 1);

      saveData();

      renderKnowledge();
    });

    card.append(details, remove);

    list.appendChild(card);
  });
}

document.getElementById("addKnowledge").addEventListener("click", () => {
  const question = document.getElementById("questionInput").value.trim();

  const answer = document.getElementById("answerInput").value.trim();

  if (!question || !answer) {
    alert("Please enter both a question and an answer.");
    return;
  }

  knowledge.push({
    question,
    answer
  });

  saveData();

  document.getElementById("questionInput").value = "";

  document.getElementById("answerInput").value = "";

  renderKnowledge();

  alert("New knowledge added to NEXORA AI!");
});

// ==========================================
// VOICE SYSTEM
// MALE / FEMALE / CHILD
// ==========================================

let availableVoices = [];

function loadVoices() {
  if (!("speechSynthesis" in window)) return;

  availableVoices = speechSynthesis.getVoices();
}

if ("speechSynthesis" in window) {
  loadVoices();

  speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Speech is not supported in this browser.");
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const gender = settings.voiceGender;

  const englishVoices = availableVoices.filter(voice =>
    voice.lang.toLowerCase().startsWith("en")
  );

  let chosenVoice = null;

  if (gender === "female") {
    chosenVoice = englishVoices.find(voice =>
      /female|zira|samantha|victoria|karen|aria|jenny/i.test(voice.name)
    );

    utterance.pitch = 1.15;
    utterance.rate = 0.95;
  }

  else if (gender === "male") {
    chosenVoice = englishVoices.find(voice =>
      /male|david|daniel|mark|james|guy/i.test(voice.name)
    );

    utterance.pitch = 0.85;
    utterance.rate = 0.95;
  }

  else if (gender === "child") {
    chosenVoice = englishVoices.find(voice =>
      /child|kid|young/i.test(voice.name)
    );

    utterance.pitch = 1.55;
    utterance.rate = 1.05;
  }

  if (chosenVoice) {
    utterance.voice = chosenVoice;
  } else if (englishVoices.length > 0) {
    utterance.voice = englishVoices[0];
  }

  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}

// ==========================================
// VOICE INPUT
// ==========================================

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

document.getElementById("micButton").addEventListener("click", () => {

  if (!SpeechRecognition) {
    alert("Voice input is not supported in this browser. Try Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.interimResults = false;

  recognition.onstart = () => {
    document.getElementById("micButton").textContent = "??";
  };

  recognition.onresult = event => {
    messageInput.value = event.results[0][0].transcript;
    sendMessage();
  };

  recognition.onerror = () => {
    alert("Voice recognition could not start. Please try again.");
  };

  recognition.onend = () => {
    document.getElementById("micButton").textContent = "??";
  };

  recognition.start();
});

// ==========================================
// SETTINGS
// ==========================================

const voiceGender = document.getElementById("voiceGender");

const speechEnabled = document.getElementById("speechEnabled");

const conversationMemory = document.getElementById("conversationMemory");

voiceGender.value = settings.voiceGender;

speechEnabled.checked = settings.speechEnabled;

conversationMemory.checked = settings.conversationMemory;

voiceGender.addEventListener("change", () => {
  settings.voiceGender = voiceGender.value;
  saveData();
});

speechEnabled.addEventListener("change", () => {
  settings.speechEnabled = speechEnabled.checked;

  if (!settings.speechEnabled && "speechSynthesis" in window) {
    speechSynthesis.cancel();
  }

  saveData();
});

conversationMemory.addEventListener("change", () => {
  settings.conversationMemory = conversationMemory.checked;

  if (!settings.conversationMemory) {
    conversations = [];
    localStorage.removeItem("nexora_conversations");
  }

  saveData();
});

document.getElementById("clearHistory").addEventListener("click", () => {
  if (!confirm("Delete all saved conversation history?")) return;

  conversations = [];

  currentConversation = [];

  localStorage.removeItem("nexora_conversations");

  alert("Conversation history cleared.");
});

document.getElementById("clearMemories").addEventListener("click", () => {
  if (!confirm("Delete all saved memories? This cannot be undone.")) return;

  memories = [];

  saveData();

  renderMemories();

  alert("All memories have been cleared.");
});

// ==========================================
// START SYSTEM
// ==========================================

renderMemories();

renderKnowledge();

console.log("NEXORA AI INITIALIZED");

console.log("NEXORA MEMORY BASE ONLINE");

console.log("NEXORA KNOWLEDGE BASE ONLINE");

console.log("NEXORA VOICE SYSTEM ONLINE");