# Code Review Fixes

## Code Smells and Improvements  ##

1. In the `book-search.component.ts`, we can use the setter function to set the search term value so that we don't need to write the same statement repetitively. We can directly assign the value to `searchTerm`. [fixed]
   
2. In the `book-search.component.html`, We are using `ngFor` to iterate the books list. There we can use the `trackBy` so it will not render the entire list again when there is any change in the list item. [fixed]
   
3. In the `book-search.component.html`, we can use the appropriate naming convention. For example, instead of using `b` Use `book`.

4. Almost every component does not cover the test cases for the defined functions. There should be some good amount of test case coverage.

5. If any observable is subscribed then it should be unsubscribed when the component destroy. It helps to prevent the memory leak.

6. There should be proper type declaration so that it prevent unwanted data to be processed.

## Lighthouse Accessibility issues  ##

1. There should be aria-label attribute to the button so that if any screen reader tool can identify it. [fixed]

2. Background and foreground colors do not have a sufficient contrast ratio. it will increase the readibility. [fixed]

## Manual Accessibility issues ##

1. Image should have the alternative text so that it enable screen readers to read the information about on-page images. [fixed]

2. Added the description to the links so that screen reader can identify it. [fixed]

3. Add role="button" to the button element help older user agents that support WAI-ARIA but not HTML5. [fixed]

4. Add role="tablist" to the div where the books array iterating and add the tabindex=0 to each div so it can be accessible by the keyboard. [fixed]

5. Added the role="presentation" to the decorative image. [fixed]

6. Added the role="presentation" to the close button appears on the reading list because it doesn't have any text. [fixed]