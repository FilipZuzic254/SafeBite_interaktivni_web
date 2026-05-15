describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
  });


  it('Testiranje gumba "Saznaj više"', function() {
    cy.visit('/')
    
    cy.get('#q-app span.block').click();
    
  });

  it('Testiranje gumbova za prikaz restorana / kafića', function() {
    cy.visit('/')
    
    cy.get('#q-app div:nth-child(1) > div.q-card > div.q-img > div.q-anchor--skip > div.choice-overlay > div.choice-title').click();
    cy.get('#q-app i[role="img"]').click();
    cy.get('#q-app a.q-router-link--active div.column').click();
    cy.get('#q-app div:nth-child(2) > div.q-card > div.q-img > div.q-anchor--skip > div.choice-overlay > div.choice-title').click();
    cy.get('#q-app i[role="img"]').click();
    cy.get('#q-app a.q-router-link--active div.column').click();
    
  });

  it('Listanje preporuka', function() {
    cy.visit('/')
    
    
    cy.get('#q-app button:nth-child(2) i.notranslate').click();
    cy.get('#q-app div.q-carousel__next-arrow i.notranslate').click();
    cy.get('#q-app div.absolute.flex-center i.notranslate').click();
    cy.get('#q-app div.q-carousel__prev-arrow i.notranslate').click();
    
  });
})