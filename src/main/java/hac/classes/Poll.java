package hac.classes;

import hac.ExceptionFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

public class Poll {
    private String pollQuestion;
    private static final PollAnswers pollAnswers = new PollAnswers();

    public Poll(URL url) throws IOException, ExceptionFile {
        createPoll(url);
    }

    private void createPoll(URL url) throws IOException, ExceptionFile {
        BufferedReader file = null;
        try {
            file = new BufferedReader(new InputStreamReader((url.openStream())));
            String question = null;
            if ((question = file.readLine()) != null) {
                pollQuestion = question;
                createAnswers(file);
            }
        } catch (IOException | ExceptionFile e) {
            throw e;
        } catch (Exception e) {
            throw e;
        } finally {
            assert file != null;
            file.close();
        }
    }

    private void createAnswers(BufferedReader file) throws ExceptionFile {
        try {
            String answer = null;
            while ((answer = file.readLine()) != null) {
                pollAnswers.add(new Answer(answer, 0));
            }

            if (pollAnswers.getSize() < 2) {
                throw new ExceptionFile("Must be at least 2 answers");
            }

        } catch (Exception e) {
            throw new ExceptionFile("Error file occurred");
        }
    }

    public final String getPollQuestion() {
        return pollQuestion;
    }

    public final PollAnswers getPollAnswers() { return pollAnswers;}
}
