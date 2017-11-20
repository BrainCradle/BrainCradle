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

 public class Test_Steps {
     public static WebDriver driver;

     @Given("^User is on Home Page$")
     public void user_is_on_Home_Page() throws Throwable {
         System.setProperty("webdriver.chrome.driver", "/Users/ailingwang/Library/Mobile Documents/com~apple~CloudDocs/Agile/BrainCradleTest/chromedriver");
         driver = new ChromeDriver();
         driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
         driver.get("https://braincradleai.firebaseapp.com/#");
     }

     @When("^User Navigate to Solution Page$")
     public void user_Navigate_to_LogIn_Page() throws Throwable {
         WebElement solutionElement = driver.findElement(By.linkText("EXAMPLES"));
         solutionElement.click();

         WebDriverWait wait = new WebDriverWait(driver, 20);

         String previousURL = driver.getCurrentUrl();

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
     }


     @Then("^User is on Solution Page$")
     public void message_displayed_Login_Successfully() throws Throwable {

         String successSolutionUrl = "https://braincradleai.firebaseapp.com/#/projects";
         String currentURL = driver.getCurrentUrl();
         Assert.assertEquals (currentURL, successSolutionUrl);

         if(currentURL.equals( successSolutionUrl)){
             System.out.println("Navigation successed.");
         }else{
             System.out.println("Navigation failed.");
         }
     }


 }