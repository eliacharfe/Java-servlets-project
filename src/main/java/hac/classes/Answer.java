package hac.classes;

public class Answer {
    private final String answer;
    private Integer numVotes;

    public Answer(String answer, Integer numVotes) {
        this.answer = answer;
        this.numVotes = numVotes;
    }
    public String getAnswer() {
        return answer;
    }

    public void increaseNumVotes(){
        this.numVotes += 1;
    }
}
