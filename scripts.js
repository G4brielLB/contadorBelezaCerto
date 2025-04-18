// Elements
const registrationSection = document.getElementById('registrationSection');
const countingSection = document.getElementById('countingSection');
const classForm = document.getElementById('classForm');
const className = document.getElementById('className');
const currentClassName = document.getElementById('currentClassName');
const currentDate = document.getElementById('currentDate');
const belezaValue = document.getElementById('belezaValue');
const certoValue = document.getElementById('certoValue');
const heheValue = document.getElementById('heheValue');
const incrementBeleza = document.getElementById('incrementBeleza');
const incrementCerto = document.getElementById('incrementCerto');
const incrementHehe = document.getElementById('incrementHehe');
const finishClass = document.getElementById('finishClass');
const historyBtn = document.getElementById('historyBtn');
const historyDropdown = document.getElementById('historyDropdown');
const historyList = document.getElementById('historyList');

// State variables
let currentClass = null;
let beleza = 0;
let certo = 0;
let hehe = 0;

// Event listeners
document.addEventListener('DOMContentLoaded', initApp);
classForm.addEventListener('submit', registerClass);
incrementBeleza.addEventListener('click', () => incrementCounter('beleza'));
incrementCerto.addEventListener('click', () => incrementCounter('certo'));
incrementHehe.addEventListener('click', () => incrementCounter('hehe'));
finishClass.addEventListener('click', finishCurrentClass);
historyBtn.addEventListener('click', toggleHistory);

// Initialize app
function initApp() {
    loadHistory();
}

// Register a new class
function registerClass(e) {
    e.preventDefault();
    
    if (!className.value.trim()) {
        alert('Por favor, insira o nome da aula.');
        return;
    }
    
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
    
    currentClass = {
        name: className.value.trim(),
        date: formattedDate,
        beleza: 0,
        certo: 0,
        hehe: 0
    };
    
    // Reset counters
    beleza = certo = hehe = 0;
    belezaValue.textContent = certoValue.textContent = heheValue.textContent = '0';
    
    // Update UI
    currentClassName.textContent = currentClass.name;
    currentDate.textContent = `Data: ${formattedDate}`;
    
    // Switch sections
    registrationSection.style.display = 'none';
    countingSection.style.display = 'block';
    
    // Reset form
    className.value = '';
}

// Increment counter
function incrementCounter(type) {
    if (!currentClass) return;
    
    switch (type) {
        case 'beleza':
            beleza++;
            belezaValue.textContent = beleza;
            break;
        case 'certo':
            certo++;
            certoValue.textContent = certo;
            break;
        case 'hehe':
            hehe++;
            heheValue.textContent = hehe;
            break;
    }
    
    currentClass[type] = parseInt(document.getElementById(`${type}Value`).textContent);
}

// Finish current class
function finishCurrentClass() {
    if (!currentClass) return;
    
    // Update final values
    currentClass.beleza = beleza;
    currentClass.certo = certo;
    currentClass.hehe = hehe;
    
    // Save to localStorage
    saveClass(currentClass);
    
    // Reset current class
    currentClass = null;
    
    // Switch sections back
    countingSection.style.display = 'none';
    registrationSection.style.display = 'block';
    
    // Update history display
    loadHistory();
}

// Save class to localStorage
function saveClass(classData) {
    const history = getHistory();
    history.push(classData);
    localStorage.setItem('classHistory', JSON.stringify(history));
}

// Get history from localStorage
function getHistory() {
    const history = localStorage.getItem('classHistory');
    return history ? JSON.parse(history) : [];
}

// Load and display history
function loadHistory() {
    const history = getHistory();
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-item"><p>Nenhuma aula registrada.</p></div>';
        return;
    }
    
    history.forEach((classItem, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <h3>${classItem.name}</h3>
            <p>${classItem.date}</p>
            <div class="counts">
                <span class="count">Beleza: ${classItem.beleza}</span>
                <span class="count">Certo: ${classItem.certo}</span>
                <span class="count">Hehe: ${classItem.hehe}</span>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Toggle history dropdown
function toggleHistory() {
    historyDropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('#historyBtn')) {
        if (historyDropdown.classList.contains('show')) {
            historyDropdown.classList.remove('show');
        }
    }
};