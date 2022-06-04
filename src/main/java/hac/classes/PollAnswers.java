package hac.classes;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class PollAnswers implements Iterable<Answer>, Iterator<Answer>{
    private static final ArrayList<Answer> pollAnswers = new ArrayList<Answer>();

    private int count = 0;

    public synchronized void add(Answer answer){
        pollAnswers.add(answer);
    }

    public final synchronized Answer getAnswer(String answer){
        for (Answer ans : pollAnswers){
            if (ans.getAnswer().equals(answer)){
                return ans;
            }
        }
        return null;
    }

    public final synchronized ArrayList<Answer> getListAnswers(){
        return pollAnswers;
    }

    public synchronized boolean exist(String answer){
        for (Answer ans : pollAnswers){
            if (ans.getAnswer().equals(answer)){
                return true;
            }
        }
        return false;
    }

    public synchronized int getSize(){
        return pollAnswers.size();
    }


    @Override
    public Iterator<Answer> iterator() {
        return this;
    }

    @Override
    public boolean hasNext() {
        return count < pollAnswers.size();
    }

    @Override
    public Answer next() {
        if (count == pollAnswers.size())
            throw new NoSuchElementException();
        count++;
        return pollAnswers.get(count- 1);
    }

    @Override
    public void remove(){
    }
}
