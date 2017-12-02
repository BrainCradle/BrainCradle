package seleniumTest;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.junit.Assert;


import java.util.concurrent.TimeUnit;

public class SeleniumTest {

    private static WebDriver driver = null;
    public static void main(String[] args) {

        // create a driver using firefox browser
        System.setProperty("webdriver.chrome.driver", "/Users/ailingwang/Library/Mobile Documents/com~apple~CloudDocs/Agile/BrainCradleTest/chromedriver");
        driver = new ChromeDriver();


        // set a time limit
        //driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        // launch our website
        driver.get("https://braincradleai.firebaseapp.com/#");
        WebDriverWait wait = new WebDriverWait(driver, 100);

        WebElement solutionElement = driver.findElement(By.linkText("Solutions"));

        String previousURL = driver.getCurrentUrl();
        System.out.println("the url before clicking is :" + previousURL);

        solutionElement.click();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

        ExpectedCondition e = new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return (!d.getCurrentUrl().equals(previousURL));
            }
        };

        wait.until(e);

        wait.until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver wdriver) {
                return ((JavascriptExecutor) driver).executeScript(
                        "return document.readyState"
                ).equals("complete");
            }
        });


        String successSolutionUrl = "https://braincradleai.firebaseapp.com/#/solutions";

        String currentURL = driver.getCurrentUrl();

        System.out.println("the url after clicking is :" + currentURL);
        Assert.assertEquals (currentURL, successSolutionUrl);
        Assert.assertTrue(driver.findElement(By.xpath("//*[contains(text(),'Solutions content will come here....')]")).isDisplayed());



        // end the test
        driver.quit();
         /*
        // Navigate to a web page
        driver.get("http://www.foo.com");

        // Perform actions on HTML elements, entering text and submitting the form
        WebElement usernameElement     = driver.findElement(By.name("username"));
        WebElement passwordElement     = driver.findElement(By.name("password"));
        WebElement formElement        = driver.findElement(By.id("loginForm"));

        usernameElement.sendKeys("Alan Smithee");
        passwordElement.sendKeys("twilightZone");

        //passwordElement.submit(); // submit by text input element
        formElement.submit();        // submit by form element


        // Anticipate web browser response, with an explicit wait
        WebDriverWait wait = new WebDriverWait(driver, 10);
        WebElement messageElement = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("loginResponse"))
        );

        // Run a test
        String message                 = messageElement.getText();
        String successMsg             = "Welcome to foo. You logged in successfully.";
        Assert.assertEquals (message, successMsg);

        // Conclude a test
        driver.quit();*/


    }


}
