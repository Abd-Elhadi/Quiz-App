// select elements
let countSpan = document.querySelector('.quiz-info .count span');
let bullets = document.querySelector('.bullets');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let results = document.querySelector('.results');
let countDownElement = document.querySelector('.countdown');


// set options 
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let questions = JSON.parse(this.responseText);
            let questionsCount = questions.length;

            // create bullets and set quiestions count
            createBullets(questionsCount);

            // add quesiton data
            addQuestionData(questions[currentIndex], questionsCount);

            // start count down
            countDown(60, questionsCount)
            // click on submit
            submitButton.onclick = () => {
                // get the right answer
                let theRightAnswer = questions[currentIndex].right_answer;

                // increae index
                currentIndex++;

                // check answer
                checkAnswer(theRightAnswer, questionsCount);

                // remove previous question
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                addQuestionData(questions[currentIndex], questionsCount);

                // handle active bullet
                handleBluttes();
                // start countdown
                clearInterval(countDownInterval);
                countDown(60, questionsCount);

                showResults(questionsCount);
            }
        }
    }

    myRequest.open('GET', './html_questions.json', true);
    myRequest.send();
}

function createBullets(num) {
    countSpan.innerHTML = num;

    // create spans
    for (let i = 0; i < num; i++) {
        let span = document.createElement('span');
        if (i === 0) {
            span.className = 'on';
        }
        // append bullets to main container
        bulletsSpanContainer.appendChild(span);
    }
}

getQuestions();

function addQuestionData(obj, count) {

    if (currentIndex < count) {
        // create h2 question title
        let questionTitle = document.createElement('h2');

        // create question text
        let questionText = document.createTextNode(obj['title']);

        // append text to h2
        questionTitle.appendChild(questionText);

        //appedn h2 to quiz area
        quizArea.appendChild(questionTitle);

        // create the options
        for (let i = 1; i <= 4; i++) {
            // cate main div for answers
            let mainDiv = document.createElement('div');

            // add class name to div
            mainDiv.className = 'answer';

            // create radio input
            let option = document.createElement('input');

            // add type, name and ID
            option.setAttribute('type', 'radio');
            option.setAttribute('name', 'question');
            option.setAttribute('id', `answer_${i}`);
            option.dataset.answer = obj[`answer_${i}`];

            // create label
            let theLabel = document.createElement('label');

            // add for attribute
            theLabel.setAttribute('for', `answer_${i}`);

            // make the first option checked

            if (i === 1) {
                option.setAttribute('checked', 'checked');
            }

            // create label text
            let theLableText = document.createTextNode(obj[`answer_${i}`]);

            // add the text to label
            theLabel.appendChild(theLableText);

            // append input and lable to main div
            mainDiv.appendChild(option);
            mainDiv.appendChild(theLabel);

            // append all divs to answers area
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rightAnswer, count) {

    let answers = document.getElementsByName('question');
    let chosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            chosenAnswer = answers[i].dataset.answer;
        }
    }

    if (chosenAnswer === rightAnswer) {
        rightAnswers++;
    }

}

function handleBluttes() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove()
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} out of ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} out of ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} out of ${count}`;
        }
        results.innerHTML = theResults;
        results.style.padding = '10px';
        results.style.backgroundColor = 'white';
        results.style.marginTop = '10px';
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
                console.log('Finished');
            }

        }, 1000);
    }
}