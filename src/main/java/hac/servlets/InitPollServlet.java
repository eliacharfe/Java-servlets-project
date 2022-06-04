package hac.servlets;

import hac.ExceptionFile;
import hac.classes.Poll;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

@WebServlet(name = "InitPollServlet", urlPatterns = {"", "/InitPollServlet"})
public class InitPollServlet extends HttpServlet {

    private final String fileError = "The poll is not available now, please come back later";

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        try {
            URL url = getServletContext().getResource(getServletContext().getInitParameter("POLLFILE"));
            servletConfig.getServletContext().setAttribute("poll", new Poll(url));
            servletConfig.getServletContext().setAttribute("message", "");
        } catch (MalformedURLException e) {
            servletConfig.getServletContext().setAttribute("message", fileError);
        } catch (IOException  | ExceptionFile e) {
            servletConfig.getServletContext().setAttribute("message", fileError);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.getRequestDispatcher("ToClientServlet").forward(request, response);
        } catch (IOException e) {
            throw e;
        }
    }
}







//    In which technology would you choose for developing your project?
//        Angular
//        Vue
//        React
//        Svelte
//        Ember