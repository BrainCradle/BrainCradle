Feature: Comment Test

  Description: This feature will test whether a logged in user can post comment.

  Scenario: Successfully post a comment
    Given User is logged in and on a blog view
    When User click on comment button and edit comment
    Then Comment is on the page