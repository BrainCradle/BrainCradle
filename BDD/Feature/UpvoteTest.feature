Feature: Upvote Test

  Description: This feature will test whether the up-vote button works properly.

  Scenario: Successful upvote for an example post
    Given User is logged in and on a example post view
    When User click on upvote button
    Then User liked the post