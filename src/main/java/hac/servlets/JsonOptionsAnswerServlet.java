package hac.servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import hac.classes.GsonBuild;
import hac.classes.Poll;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.Objects;

@WebServlet(name = "JsonOptionsAnswerServlet", value = "/JsonOptionsAnswerServlet")
public class JsonOptionsAnswerServlet extends HttpServlet {
    private Poll poll = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            poll = (Poll) request.getServletContext().getAttribute("poll");
            String errorMsg = (String) request.getServletContext().getAttribute("message");

            if (!Objects.equals(errorMsg, "")) {
                response.getWriter().write(new Gson().toJson(false));
            }
            else {
                GsonBuild build = new GsonBuild(poll.getPollQuestion(), poll.getPollAnswers());
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                response.getWriter().write(gson.toJson(build));
            }
        } catch (Exception e){
            throw e;
        }
    }
}
