package hac.servlets;

import com.google.gson.Gson;
import hac.classes.Answer;
import hac.classes.PollAnswers;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@WebServlet(name = "JsonPollServlet", urlPatterns = "/JsonPollServlet")
public class JsonPollServlet extends HttpServlet {
    private static final PollAnswers pollAnswers = new PollAnswers();
    private static final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            setCookie(response, "visited-cookie");

            if (isFirstTime(request.getCookies(), "visited-cookie")) {
                takeVote(request);
                response.getWriter().write(gson.toJson(pollAnswers.getListAnswers()));
            }
            else {
                response.getWriter().write(gson.toJson(false));
            }
        } catch (IOException e) {
           throw e;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    private void takeVote(HttpServletRequest request) throws IOException {
        try {
            String pollAnswer = request.getParameter("answer");
            if (!pollAnswers.exist(pollAnswer)) {
                pollAnswers.add(new Answer(pollAnswer, 1));
            } else {
                pollAnswers.getAnswer(pollAnswer).increaseNumVotes();
            }
        } catch (Exception e) {
          throw e;
        }
    }

    private void setCookie(HttpServletResponse response, String cookieName) {
        Cookie visit = new Cookie(cookieName, "visited-cookie");
        visit.setMaxAge(60 * 60); // 1 hour
        response.addCookie(visit);
    }

    private boolean isFirstTime(Cookie[] cookies, String cookieName) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(cookieName)) {
                return false;
            }
        }
        return true;
    }
}







//            RequestDispatcher rd = request.getRequestDispatcher("/CreateAnswerServlet");
//            rd.include(request, response);



//    private String getPollAnswer(HttpServletRequest request) throws IOException {
//        StringBuilder stringBuilder = new StringBuilder();
//        BufferedReader bufferedReader = request.getReader();
//        String str = null;
//        while ((str = bufferedReader.readLine()) != null) {
//            stringBuilder.append(str);
//        }
//        String json = stringBuilder.toString();
//        JsonReader jsonReader = Json.createReader(new StringReader(json));
//        JsonObject jsonObject = jsonReader.readObject();
//        jsonReader.close();
//
//        return jsonObject.getString("answer");
//    }