package hac.classes;

import java.util.ArrayList;

public class GsonBuild {

    private String question;
    private ArrayList<Answer> answers;

    public GsonBuild(String question, PollAnswers answers){
        this.question = question;
        this.answers = answers.getListAnswers();
    }

}
