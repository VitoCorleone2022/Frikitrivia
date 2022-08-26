//game variables
const GAME = {
  life: 3,
  questionCount: -1,  //array
  score: 0,
  clickCount: 0,
  numberOfquestions: 10,
  displayQuestionNumber: 0,
  questions: null,

  async loadQuestions() {
    await axios
      .get("https://opentdb.com/api.php?amount=10&category=31")
      .then((questions) => {
        console.log(this);
        console.log(questions.data.results);
        this.questions = questions.data.results
      })
      .catch((err) => {
        console.log("rejected: ", err);
      });
  },

  createBooleanQuestion() {
    console.log("boolean");
    let wrongAnswer = this.questions[this.questionCount].incorrect_answers[0];
    let rightAnswer = this.questions[this.questionCount].correct_answer;

    $("#question").append(
      `<div id="wrong-btn" class="btn wrong-btn"> ${wrongAnswer} </div>`
    );
    $("#question").append(
      `<div id="right-btn" class="btn"> ${rightAnswer} </div>`
    );
    //interaction
    $("#right-btn").click(() => {
      console.log("this is the right answer:" + rightAnswer);
      $("#solution").text("Correct :)");
      $("#right-btn").addClass("right");
      $("#right-btn").off("click");
      $("#wrong-btn").off("click");
      this.updateScoreCounter();
      this.nextButton();
      this.checkGameOver();
    });

    $("#wrong-btn").click(() => {
      console.log("this is the wrong answer:" + wrongAnswer);
      $("#solution").text("Wrong :c");
      $("#wrong-btn").addClass("wrong");
      $("#right-btn").off("click");
      $("#wrong-btn").off("click");
      this.updateLife();
      this.nextButton();
      this.checkGameOver();
    });
  },

  createMultipleQuestion() {
    let wrongAnswer = this.questions[this.questionCount].incorrect_answers[0];
    let rightAnswer = this.questions[this.questionCount].correct_answer;
    $("#question").append(
      `<div id="right-btn" class="btn"> ${rightAnswer} </div>
           <div class="btn wrong-btn"> ${wrongAnswer[0]}</div>
           <div class="btn wrong-btn"> ${wrongAnswer[1]}</div>
           <div class="btn wrong-btn"> ${wrongAnswer[2]}</div>`
    );
    //interaction
    document
      .getElementById("right-btn")
      .addEventListener("click", () => {
        this.rightButtonClick()
      })

    // document.querySelectorAll(".wrong-btn").forEach((button) => {
    //   button.addEventListener("click", this.wrongButtonClick);
    // });

    document.querySelectorAll(".wrong-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.wrongButtonClick(event)
      });
    });
  },

  nextQuestion() {
    this.questionCount++
    this.displayQuestionNumber++
    this.updateQuestionCounter()
    $("#question").html(
      `<div> ${this.questions[this.questionCount].question} </div>`
    );

    if (this.questions[this.questionCount].type === "boolean") {
      this.createBooleanQuestion();
      this.orderAnswersRandomly()
    }

    if (this.questions[this.questionCount].type === "multiple") {
      this.createMultipleQuestion();
      this.orderAnswersRandomly()
    }
  },
  updateQuestionCounter() {
    $("#questionCount").text(`${this.displayQuestionNumber}/10`)
  },
  updateScoreCounter() {
    this.score++;
    $("#scoreCount").text(`Score: ${this.score}`);
  },
  updateLife() {
    this.life--;
    $("#life").text("Life: " + this.life);
    if (this.life === 0) {
      console.log("game over!");
      $("#game").fadeOut();
      $("#finalScore").text(`Your final score is: ${this.score}`);
      $("#score").fadeIn();
    }
  },
  checkGameOver() {
    if (++this.clickCount === this.numberOfquestions) {
      $("#next-btn").css("display", "none");
      $("#game").delay(3000).fadeOut();
      $("#finalScore").text(`Your final score is: ${this.score}`);
      $("#score").delay(3000).fadeIn();

    }
  },
  nextButton() {
    $("#next-btn").fadeIn();
  },
  wrongButtonClick(event) {
    this.offButtons();
    this.nextButton();
    this.checkGameOver();

    $("#solution").text("Wrong :c");
    event.target.classList.add("wrong");
    this.updateLife();
  },
  rightButtonClick() {
    this.offButtons();
    this.nextButton();
    this.checkGameOver();

    $("#solution").text("Correct :)");
    $("#right-btn").addClass("right");
    this.updateScoreCounter();

  },
  offButtons() {
    // $('.wrong-btn').each(()=> {
    //   $(this).unbind('click')
    // })
    // $('#right-btn').unbind('click')

    document
      .getElementById("right-btn")
      .removeEventListener("click", () => {
        this.rightButtonClick()
      })

    document.querySelectorAll(".wrong-btn").forEach((elem) => {
      elem.removeEventListener("click", () => {
        this.wrongButtonClick()
      })
    })
  },
  
  orderAnswersRandomly() {
    //multiple answers
    if ($('.wrong-btn').length > 1) {
      let randomIndex = Math.floor(Math.random() * 5)
      $('.wrong-btn').eq(randomIndex).before($('#right-btn'))
      if (randomIndex === 0) {
        $('.wrong-btn').eq(randomIndex).before($('#right-btn'))
      }
      if (randomIndex === 1) {
        $('.wrong-btn').eq(randomIndex).before($('#right-btn'))
      }
      if (randomIndex === 2) {
        $('.wrong-btn').eq(randomIndex).after($('#right-btn'))
      }
      if (randomIndex === 3) {
        $('.wrong-btn').eq(2).after($('#right-btn'))
      }
    } else {
      //true or false
      let randomNumber = Math.floor(Math.random() * 10)
      if (randomNumber < 5) {
        $('.wrong-btn').eq(0).before($('#right-btn'))
      }
      if (randomNumber >= 5) {
        $('.wrong-btn').eq(0).after($('#right-btn'))
      }
    }
  },
  reset() {
    this.life = 3;
    this.questionCount = 0;
    this.score = 0;
    this.clickCount = 0;
    $("#life").text("Life: " + this.life);
    $("#scoreCount").text(`Score: ${this.score}`);
    $("#questionCount").text(`${this.questionCount}/10`);
    $("#next-btn").css("display", "none");
    $("#score").fadeOut();
    $("#landing").fadeIn();
  },
  async init() {
    await GAME.loadQuestions();

    $("#play-btn").click(() => {
      $("#landing").fadeOut();
      $("#game").fadeIn();
      this.updateQuestionCounter()
      this.nextQuestion();
    });

    $("#next-btn").click(() => {
      this.nextQuestion();
      $("#solution").text("");
      $("#next-btn").fadeOut();
    });

    $("#replay-btn").click(() => {
      this.reset();
    });
  },
};

(async function () {
  await GAME.init();
})();