
ERROR = "The poll is not available now, please come back later";
ERROR_NOT_SELECTED = "You have to choose an answer in order to submit";
ALREADY_SUBMITTED_ERROR = "You have already answered the poll";
const LOAD_IMG_SRC = "<img src=https://64.media.tumblr.com/ec18887811b3dea8c69711c842de6bb9/tumblr_pabv7lGY7r1qza1qzo1_500.gifv  alt='...' >";

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        initOptionsAnswer();
        document.getElementById("myForm").addEventListener("submit", validateForm);
    }, false);
    //---------------------------------------
    const validateForm = function (event) {
        event.preventDefault();
        let divError = document.querySelector("#errorDiv");
        divError.className = "alert alert-danger d-none";
        const radioButtons = document.querySelectorAll('[type="radio"][name="answer"]:checked');

        if(radioButtons.length === 0)
            return error(divError, ERROR_NOT_SELECTED);

        handlePollAnswer(radioButtons[0].value.trim(), divError);
    }
    //----------------------------------------
    function initOptionsAnswer() {
        let divError = document.querySelector("#errorDiv");
        divError.className = "alert alert-danger d-none";
        document.querySelector("#dataDiv").className = "d-none";
        let pollAnswerList = new classesModule.pollAnswerList();

        fetch("JsonOptionsAnswerServlet", { method: 'GET'})
            .then(response => response.json())
            .then(res => {
                if (res){
                    document.querySelector("#question").innerHTML = res.question;
                    res.answers.forEach(ans => {
                        addAnswer(ans.answer, ans.numVotes, pollAnswerList);
                    });
                    generateAnswerOptions(pollAnswerList, "answerOptions");
                } else {
                    hide();
                    error(divError, ERROR)
                }
            }).catch(e => {
            hide();
            error(divError, ERROR)
        });
    }

    //------------------------------------------------
    function generateAnswerOptions(pollAnswerList) {
        document.querySelector("#answerOptions").innerHTML = pollAnswerList.generateHTMLOption();
    }
    //----------------------------------------------------------
    function handlePollAnswer(pollAnswer, divError) {
        let pollAnswerList = new classesModule.pollAnswerList();
        let loadingImg = document.querySelector('#loading');
        loadingImg.style.display = "block";
        loadingImg.innerHTML = LOAD_IMG_SRC;

        fetch("JsonPollServlet", {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'datatype': 'json' },
            body: new URLSearchParams({ answer : pollAnswer}).toString()
        }).then(response => response.json()).then(res => {
            loadingImg.innerHTML = "";
            if (res) {
                res.forEach(ans => {
                    addAnswer(ans.answer, ans.numVotes, pollAnswerList);
                });
                generateAnswers(pollAnswerList, "data");
            } else {
                error(divError, ALREADY_SUBMITTED_ERROR)
            }
        }).catch(e => {
            hide();
            error(divError, ERROR)
        });
    }

    //----------------------------------
    function addAnswer(answer, numVotes, pollAnswerList) {
        pollAnswerList.add(new classesModule.Answer(answer, numVotes)); // add if not exist
    }
    //--------------------------------------
    function generateAnswers(pollAnswerList, where) {
        pollAnswerList.sort(); // sort by number of votes (from greater to lower)
        document.querySelector("#dataDiv").className = "d-block";
        document.getElementById(where).innerHTML = pollAnswerList.generateHTML();
    }
    //-------------------------
    function error(where, what){
        where.className = "alert alert-danger";
        where.innerHTML = what;
    }
    //-----------------------------
    function hide(){
        document.querySelector("#dataDiv").className = "d-none";
        document.querySelector("#question").className = "d-none";
        document.querySelector("#answerOptions").className = "d-none";
        document.querySelector("#btnSubmit").style.display = "none";
        document.querySelector("#images").className = "d-none";
        document.querySelector('#loading').innerHTML = ""
    }
})();
//----------------------------
const classesModule = (() => {
    let pollAnswers = {}

    pollAnswers.Answer = class Answer {
        constructor(answer, numVotes) {
            this.answer = answer.trim();
            this.numVotes = numVotes;
        }

        createDivPollAnswer() {
            return `
            <div>
               <div class="card text-center border border-5 rounded-3 mb-1">
                 <div class="card-body mycard">
                    <p class="card-text"><strong>${this.answer} - ${this.numVotes}</strong></p>
                  </div>
                </div>
            </div>`;
        }

        createDivOption() {
            return `
            <div class="form-check mb-3">
            <label class="myinput">
              <input class="form-check-input myinput" type="radio" name="answer" value="${this.answer.trim()}">
               ${this.answer.trim()}
            </label>
            </div>`;
        }
    }
    //----------------------------------
    pollAnswers.pollAnswerList = class {
        constructor() {
            this.list = [];
        }

        add(answer) {
            if (!this.exist(answer.answer))
                this.list.push(answer);
        }

        search(what) {
            return this.list.find((ans) => ans.answer === what) !== undefined;
        }

        exist(answer) {
            return this.search(answer)
        }

        generateHTML() {
            let res = "";
            for (const answer of this.list)
                res += answer.createDivPollAnswer();
            return res;
        }

        generateHTMLOption() {
            let res = "";
            for (const answer of this.list)
                res += answer.createDivOption();
            return res;
        }

        sort() {
            this.list.sort(function(a, b) {
                return b.numVotes - a.numVotes;
            });
        }
    }

    return pollAnswers;
})();