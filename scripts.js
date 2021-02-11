
//dark mode

const html = document.querySelector("html")
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) =>
    window
        .getComputedStyle(element)
        .getPropertyValue(style)

const initialColors = {
    bg: getStyle(html, "--bg"),
    bgCards: getStyle(html, "--bg-cards"),
    colorText: getStyle(html, "--dark-blue"),
}

const darkMode = {
    bg: "#0e1627",
    bgCards: "#152039",
    colorText: "#dddddd",
}

const transformKey = key => "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()

const changeColors = (colors) => {
    Object.keys(colors).map(key =>
        html.style.setProperty(transformKey(key), colors[key])
        )
}

checkbox.addEventListener("change", ({target}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

//Salvando tema no local storage
const isExistLocalStorage = (key) => 
  localStorage.getItem(key) != null

const createOrEditLocalStorage = (key, value) => 
  localStorage.setItem(key, JSON.stringify(value))

const getValeuLocalStorage = (key) =>
  JSON.parse(localStorage.getItem(key))

checkbox.addEventListener("change", ({target}) => {
  if (target.checked) {
    changeColors(darkMode) 
    createOrEditLocalStorage('modo','darkMode')
  } else {
    changeColors(initialColors)
    createOrEditLocalStorage('modo','initialColors')
  }
})

if(!isExistLocalStorage('modo'))
  createOrEditLocalStorage('modo', 'initialColors')


if (getValeuLocalStorage('modo') === "initialColors") {
  checkbox.removeAttribute('checked')
  changeColors(initialColors);
} else {
  checkbox.setAttribute('checked', "")
  changeColors(darkMode);
}


// show - hidden modal

const Modal = {
    open(){
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },

    close(){
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
} 



const transactions = [
{
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021',
}, 
{
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '23/01/2021',
}, 
{
    id: 3,
    description: 'Identidade visual',
    amount: 100000,
    date: '23/01/2021',
}, 
{
    id: 4,
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021',
}, 
]

//Responsavel pelo calculo matematico de entradas, saidas e total
const Transaction = {
    all: transactions,
    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },
    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income;

    },

    expenses() {
        let expenses = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expenses += transaction.amount;
            }
        })

        return expenses;
    },
    
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
    
    
}

const DOM = {
    trasactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
       
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        
        DOM.trasactionsContainer.appendChild(tr)
    },


    innerHTMLTransaction(transaction) {
        

        const CSSclass = transaction.amount > 0 ? "income" :
        "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = 
        `
    <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" 
            alt="Remover Transação">
        </td>
    </tr>
    `

    return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
        },
    
    clearTransactions() {
        DOM.trasactionsContainer.innerHTML = ""
    }
}


//formatação dos valores 

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
    
}

const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        
        
        DOM.updateBalance()
        
     
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

Transaction.add({
    id: 5,
    description: "Gatos",
    amount: 200,
    date: '23/01/2021'
})