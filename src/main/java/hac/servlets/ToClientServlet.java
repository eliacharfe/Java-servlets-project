package hac.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "ToClientServlet", urlPatterns = "/ToClientServlet")
public class ToClientServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.getRequestDispatcher("JsonOptionsAnswerServlet").include(request, response); // only once
            getServletContext().getRequestDispatcher("/poll.html").forward(request,response); // only once

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            throw e;
        }
    }
}
