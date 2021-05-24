const body = document.querySelector("body") //body element
const keys = document.querySelectorAll('.key') // All the keys on the calculator
const numKeys = document.querySelectorAll('.num') // All the number keys (including '.')
const display = document.querySelector('.display') //The display screen
const calculator = document.querySelector(".calculator") //Whole calculator
const operatorKeys = document.querySelectorAll(".operator") // nodeList of All the operator keys
const themeToggle = document.querySelector(".themes .button") // Theme toggle switch
const buttonWidth = document.querySelector(".button").offsetWidth // Width of Theme toggle switch
const secondDisplay = document.querySelector(".secondary-display") // Secondary display showing the record of the calculations.


//making array of all the operatorss in calculator
var operators =[]
operatorKeys.forEach(operator => operators.push(operator.innerHTML))
console.log('operators '+operators )


// Playing click sound
keys.forEach( key => {key.addEventListener("click",()=>{
    document.querySelector("audio").play()
})
}) 

//Setting user's preferred theme. If the user opens the website again in future, the preferred theme will be automatically applied. 

// It the user has opened the website for the first time, ask for user's preferred theme
if (localStorage.getItem('prefersTheme') === null){ 
   
    alert('Select preferred theme from the following three")
    var counter = 0
          
    //Show the user, a preview of all the themes before prompting them for an input
    const themePreviews = setInterval(()=>{ 
        counter++
        if(counter === 4){
            counter = 3
            stopInterval(themePreviews)
        } else {
            changeTheme(counter)
        }
    },3000)
}


// If the user wants to change their preferred theme  

document.addEventListener('keydown',(event)=>{
    if (event.key === 'Shift'){
        localStorage.removeItem('prefersTheme')
        alert("Select preferred theme from the following three")
        var counter = 0
        const themePreviews = setInterval(()=>{ 
            counter++
            if(counter === 4){
                counter = 3
                stopInterval(themePreviews)
            } else {
                changeTheme(counter)
            }
        },3000)
    }
})


// Storing user's preferred theme in a variable on the local storage of the browser.
function setPreferredTheme(){
    var preferredTheme = prompt("Enter your preferred theme, to reset your preferred theme, press 'shift'.")
    while(!['1','2','3'].includes(preferredTheme)){
            alert('Invalid choice, choose only between 1 to 3')
            preferredTheme = prompt('Enter your preferred theme')
        }
    localStorage.setItem('prefersTheme',String(preferredTheme))
    changeTheme(localStorage.getItem('prefersTheme'))
}


// To stop the Theme preview
function stopInterval(interval){
    clearInterval(interval)
    setPreferredTheme()
}


//Changing the theme to the preferred theme
changeTheme(localStorage.getItem('prefersTheme'))


// To change the theme. Arguement is the theme number.
function changeTheme(themeCounter){
    currentTheme = body.className.slice(-6,)
    theme = 'theme'+themeCounter
    calculator.classList.remove(currentTheme)
    calculator.classList.add(theme)
    body.classList.remove(currentTheme)
    body.classList.add(theme)

    var toggleShift = buttonWidth*0.05
    toggleShift += (themeCounter-1)*(buttonWidth/3.2)
    console.log("toggle : "+toggleShift)
    document.querySelector(".themes .button .toggle").style.left=toggleShift+'px' 
}


//Adding functionality to the Theme toggle switch
var theme = ''
var themeCounter = 1
var currentTheme = ''
var clickPosition = 0
var clickPositionPercent = 0
var noOfThemes = parseInt(calculator.getAttribute("data-themes"))


themeToggle.addEventListener("click", (event)=>{
    clickPosition = event.offsetX
    console.log("offset : "+clickPosition+" width : "+buttonWidth)
    clickPositionPercent = (clickPosition / buttonWidth) *100
    if (clickPositionPercent < 33 ){
        themeCounter = 1
    } else if (clickPositionPercent > 33 && clickPositionPercent < 67){
        themeCounter = 2
    } else {
        themeCounter = 3
    }

    changeTheme(themeCounter)
})



//Adding the calculating functionality

var num 
var a = 0
var b = 0
var operator
var answer = []
var nextOperator
var operands = 0
var operandIndex = 0
var recordString = ''
var displayString = ''
var firstOperatorClicked = false


numKeys.forEach(num => {  //adding eventlistener to every key other than 'del', 'reset' and 'equal', to display on the screen

    num.addEventListener('click',()=>{

        var value = num.getAttribute('data-value')

        if (operators.includes(value) && !operators.includes(displayString[displayString.length-1])){

            if (firstOperatorClicked){
                b = displayString.slice(operandIndex,)
                // operandIndex = 0 
                nextOperator = value
                console.log('A : '+a+" B : "+b)
                a = calculate(a, b, operator)
            } else {
                firstOperatorClicked = true
                a = displayString.slice(operandIndex,)
                console.log("A : "+a)
                operator = value
                operandIndex = displayString.length+1   
            }
            
        }
        value = String(value)

        if (operators.includes(value) && operators.includes(displayString[displayString.length-1])){

            if (operators.includes(recordString[recordString.length-1])){
                recordString = recordString.slice(0,recordString.length-1)
            }

            displayString = displayString.slice(0,displayString.length-1)
            console.log(displayString)
            answer=answer.slice(0,answer.length-1)
            operator = value

        }

        displayString +=value
        recordString += value
        secondDisplay.innerText = recordString
        console.log(value, displayString)
        display.innerText=displayString
    })
});


function calculate(a, b, operator){
    var result = 0
    a = parseFloat(a)
    b = parseFloat(b)
    console.log("inside a :"+a+"inside b :"+b+" operator : "+operator)
    switch (operator){
        case "/": 
                result = a/b
                break

        case '✖':
                result = a*b
                break
        case '+':
                result = a+b 
                break
        case '-':
                result = a-b
                break
    }
    
    result = rounding(result,3)
    if(equalPressed){
        displayString = String(result)
        operator = 0
        operandIndex = 0
        equalPressed = false
        display.innerText=displayString
        firstOperatorClicked = false
    }
    else {
        displayString = String(result)+nextOperator
        operandIndex = displayString.length
        operator = nextOperator
    }

    return result
}


function rounding(num, places) {
    num = parseFloat(num);
    places = (places ? parseInt(places, 10) : 0)
    if (places > 0) {
        let length = places;
        places = "1";
        for (let i = 0; i < length; i++) {
            places += "0";
            places = parseInt(places, 10);
        }
    } else {
        places = 1;
    }
    return Math.round((num + Number.EPSILON) * (1 * places)) / (1 * places)
}

var lastAdded = false
if (displayString === ''){
    lastAdded = false
}
document.querySelector(".reset").addEventListener('click',reset)

document.querySelector(".del").addEventListener('click',()=>{
    displayString=displayString.slice(0,-1)
    display.innerText=displayString 
    recordString=recordString.slice(0,-1)
    secondDisplay.innerText=recordString  
    if (displayString === ''){
        reset()
    }
})

// Calculating the expression
var equalPressed = false
document.querySelector('.equal').addEventListener("click",()=>{
    if (lastAdded){
    answer.push(displayString.slice(operandIndex,))
    lastAdded = true
    }
    if (firstOperatorClicked && !operators.includes(displayString[displayString.length-1])){
        b = displayString.slice(operandIndex,)
        console.log("Inside equal a : "+a+" b : "+b+" operator : "+operator)
        operandIndex = 0
        equalPressed = true
        a = calculate(a, b, operator)
        console.log("Inside equal a : "+a)
    }
    var res= clearNull(answer)
})

function reset(){
    displayString=''
    display.innerText=''
    recordString = ''
    secondDisplay.innerText = ''
    lastAdded = false
    a = 0
    b = 0
    operandIndex = 0 
    operator = 0
    firstOperatorClicked = false
}

function clearNull(arr){
    var res =[]
    for (var i = 0; i<arr.length; i++){
        if (arr[i] != ''){
            res.push(arr[i])
        }
    }
    return res
}
