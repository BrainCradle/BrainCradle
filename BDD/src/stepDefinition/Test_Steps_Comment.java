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

public class Test_Steps_Comment {
    public static WebDriver driver;

    @Given("^User is logged in and on a blog view$")
    public void user_is_on_Home_Page() throws Throwable {
        System.setProperty("webdriver.chrome.driver", "/Users/ailingwang/Library/Mobile Documents/com~apple~CloudDocs/Agile/BrainCradleTest/chromedriver");
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("https://braincradleai.firebaseapp.com/#");

        driver.findElement(By.id("login")).click();
        driver.findElement(By.id("email")).sendKeys("andy@gmail.com");
        driver.findElement(By.id("password")).sendKeys("andy12345");
        driver.findElement(By.xpath("//button[text()='Log In']")).click();

        driver.findElement(By.linkText("BLOG")).click();
        driver.findElement(By.xpath("//*[contains(text(), 'machine learning')]")).click();

    }
    @When("^User click on comment button and edit comment$")
    public void user_Navigate_to_LogIn_Page() throws Throwable {
        driver.findElement(By.id("comment button")).click();
        driver.findElement(By.xpath("//*[@ng-model='blogsCtrl.comment.comment_title']"))
                .sendKeys("Good Content");
        driver.findElement(By.linkText("Save CommentS")).click();
    }

    @Then("^Comment is on the page$")
    public void message_displayed_Login_Successfully() throws Throwable {

        String bodyText = driver.findElement(By.tagName("body")).getText();
        Assert.assertTrue("Text not found!", bodyText.contains("Good Content"));
        driver.quit();
    }

}
