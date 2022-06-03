if (typeof document !== "undefined") {
    document.addEventListener('DOMContentLoaded', () => { // listen and wait for DOM
        mainModul.getById("addBtn").addEventListener("click", mainModul.addButtonClicked); // submit when click
        mainModul.getById("sortBtn").addEventListener('click', mainModul.buttonsModul.sort);//sort toDoList
        mainModul.getById('showHighPriority').addEventListener('click', mainModul.buttonsModul.showHighPriority);// show high priority
        mainModul.getById('backBtn').addEventListener('click', mainModul.buttonsModul.backButton);

        mainModul.getById('titleID').addEventListener('keydown', function (event) {
            if (event.code === 'Enter') { // when press enter go to the next input in form (from title to the description)
                event.preventDefault();
                let form = event.target.form;
                let index = Array.prototype.indexOf.call(form, event.target);
                form.elements[index + 1].focus();
            }
        });
    });
}
//-------------------------------------------------
//---------------------------------------------------
const mainModul = (() => {

    let toDoList = []
    let publicData = {}

    class Task {
        constructor(title, description, priority) {
            this.title = title;
            this.description = description.replace(/\n\r?/g, "<br />"); // when pressed Enter key will insert new line to the string of the description text
            this.priority = priority;
        }

        createDiv() {
            // create new card div with title, description and button, then return the div
            let myDiv = createNode('div');
            this.priority ? myDiv.contentEditable = 'true' : myDiv.contentEditable = 'false';

            let card = createNode('div');
            this.priority ? appendNode(myDiv, card, 'card w-100  border border-5 rounded-3 alert-warning mb-2', '')
                : appendNode(myDiv, card, 'card w-100  border border-5 rounded-3 mb-2', '');

            let cardBody = createNode('div');
            appendNode(card, cardBody, "card-body", '');

            let titleCard = createNode('h5');
            appendNode(cardBody, titleCard, 'card-title', this.title);

            let descriptionCard = createNode('p');
            appendNode(cardBody, descriptionCard, 'card-text', this.description);

            let btnDelete = createNode('button');
            appendNode(cardBody, btnDelete, 'btn btn-danger', "Delete");

            return myDiv;
        }
    }

    //-----------------------------
    const createNode = function (node) {// generic func
        return document.createElement(node);
    }
    //---------------------------------------
    const appendNode = function (parent, child, nameClass, text) { // generic func
        child.className = nameClass;
        child.innerHTML = text;
        parent.appendChild(child);
    }
    //--------------------------------------------------------------------
    publicData.addButtonClicked = function () {
        //when the add button is clicked (or clicked Space)
        let inpTitle = mainModul.getById("titleID");
        let inpDescription = mainModul.getById("descriptionID");
        let checkBox = mainModul.getById("checkbox");
        let incorrectInput = mainModul.getById('incorrectInput');
        incorrectInput.value = '';

        if (!validationModul.correctInput(inpTitle, inpDescription, incorrectInput))
            return;

        // if got here ==> correct inputs
        inpTitle.setAttribute('class', 'form-control'); // in case was invalid because had bad input before
        inpDescription.setAttribute('class', 'form-control');

        toDoList.push(new Task(inpTitle.value, inpDescription.value, checkBox.checked));
        displayList();

        incorrectInput.setAttribute("class", "d-none");
        inpTitle.value = inpDescription.value = '';
    }

    //------------------------------------------------------------
    const displayList = function () { // display list of tasks to the DOM
        mainModul.getById("myDiv").innerHTML = '';// clear div
        toDoList.forEach(task => {
            mainModul.getById("myDiv").appendChild(task.createDiv()); // inset tasks to div dom
        });

        mainModul.buttonsModul.buttonsDeleteHandle("myDiv"); // buttons handle
    }
    //--------------------------------------
    publicData.getById = function (container) {// generic func
        return document.getElementById(container);
    }

      //---------------------------------
     //---------------------------------
    // modul validation  (inside mainModul)
    const validationModul = (() => {
        let publicDataValidation = {}

        publicDataValidation.correctInput = function (inpTitle, inpDescription, incorrectInput) {
            // check inputs and return true if all is correct inputs, else will show user what problem he have and return false
            if (isEmpty(inpTitle) || !isLetterOrNumber(inpTitle)) {
                error('Please enter a non empty title with letters and digits only\n', incorrectInput);
                inpTitle.value = '';
                inpTitle.setAttribute('class', 'form-control is-invalid');
                return false;
            }
            if (isAlreadyExistTitle(inpTitle.value)) {
                error('This task name already exist. Choose another name for the task\n', incorrectInput);
                inpTitle.setAttribute('class', 'form-control is-invalid');
                inpTitle.value = '';
                return false;
            }
            if (isEmpty(inpDescription)) {
                error('Please enter a non empty text description\n', incorrectInput);
                inpDescription.setAttribute('class', 'form-control is-invalid');
                inpDescription.value = '';
                return false;
            }
            return true; // correct input
        }
        //----------------------------------------------
        const isAlreadyExistTitle = function (title) {
            return toDoList.some(function (el) {
                return el.title === title;
            });
        }
        //-----------------------------------------------
        const isLetterOrNumber = function (inp) {
            return inp.value.match(/^[0-9a-zA-Z\s]+$/);
        }
        //-------------------------------------
        const isEmpty = function (inp) {
            return (inp.value.trim().length === 0);
        }
        //----------------------------------------
        const error = function (str, incorrectInp) {
            incorrectInp.innerHTML = str;
            incorrectInp.setAttribute("class", "alert alert-danger");
        }

        return publicDataValidation;
    })();
      //--------------------------------
     //--------------------------------
    // buttons modul (inside mainModul)
    publicData.buttonsModul = (() => {
        let publicDataButtons = {}

        publicDataButtons.sort = function () { // sort the array of tasks by title
            toDoList.sort((a, b) => {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });

            displayList();
        }
        //--------------------------
        publicDataButtons.showHighPriority = function () {
            // show high priority list
            mainModul.getById('mainDiv').style.display = "none";
            mainModul.getById('divShowHigh').style.display = "block";

            mainModul.getById("divHighPriority").innerHTML = ''; // clear div
            toDoList.forEach(task => {
                if (task.priority)
                    mainModul.getById('divHighPriority').appendChild(task.createDiv());
            });

            mainModul.buttonsModul.buttonsDeleteHandle("divHighPriority"); // buttons handle
        }
        //----------------------------
        publicDataButtons.backButton = function () {
            // when pressed on the back button
            mainModul.getById('mainDiv').style.display = "block";
            mainModul.getById('divShowHigh').style.display = "none";
            displayList();
        }
        //-------------------------------------------------------------
        publicDataButtons.buttonsDeleteHandle = function (currDivOutput) {
            // generic function that check if buttons pressed on div of the curr display window (regular / high priority mode
            // and delete the task if pressed on its delete button
            let buttons = mainModul.getById(currDivOutput).querySelectorAll('button');

            buttons.forEach(btn => {
                btn.addEventListener('click', function () {
                    let title = btn.parentElement.getElementsByTagName('h5')[0].innerHTML;
                    btn.parentElement.parentElement.parentElement.remove();
                    toDoList.forEach(task => {
                        if (task.title === title)
                            toDoList.splice(toDoList.indexOf(task), 1);
                    });
                })
            })
        }

        return publicDataButtons;
    })();

    return publicData;
})();
