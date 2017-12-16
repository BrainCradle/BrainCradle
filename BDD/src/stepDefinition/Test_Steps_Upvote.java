package stepDefinition;


import java.util.concurrent.TimeUnit;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;


public class Test_Steps_Upvote {
    public static WebDriver driver;

    @Given("^User is logged in and on a example post view$")
    public void user_is_on_Home_Page() throws Throwable {
        System.setProperty("webdriver.chrome.driver", "/Users/ailingwang/Library/Mobile Documents/com~apple~CloudDocs/Agile/BrainCradleTest/chromedriver");
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("https://braincradleai.firebaseapp.com/#");

        driver.findElement(By.id("login")).click();
        driver.findElement(By.id("email")).sendKeys("andy@gmail.com");
        driver.findElement(By.id("password")).sendKeys("andy12345");
        driver.findElement(By.xpath("//button[text()='Log In']")).click();

        driver.findElement(By.linkText("EXAMPLES")).click();
        driver.findElement(By.xpath("//*[contains(text(), 'Image')]")).click();

        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver wdriver) {
                return ((JavascriptExecutor) driver).executeScript(
                        "return document.readyState"
                ).equals("complete");
            }
        });


    }
    @When("^User click on upvote button$")
    public void user_Navigate_to_LogIn_Page() throws Throwable {
        driver.findElement(By.id("upVote")).click();
        driver.findElement(By.id("upVote")).click();
        driver.findElement(By.id("upVote")).click();

        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver wdriver) {
                return ((JavascriptExecutor) driver).executeScript(
                        "return document.readyState"
                ).equals("complete");
            }
        });
    }

    @Then("^User liked the post$")
    public void message_displayed_Login_Successfully() throws Throwable {

        String upVoteNumber = driver.findElement(By.id("upVoteNumber")).getText();
        Assert.assertEquals(upVoteNumber,"1");
        driver.quit();
    }

}
