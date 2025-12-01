const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/restorani', component: () => import('pages/SviRestoraniPage.vue') },
      { path: '/kafici', component: () => import('pages/SviKaficiPage.vue') },
      { path: '/prijava/korisnik', component: () => import('pages/PrijavaKorisnikaPage.vue') },
      { path: '/prijava/administrator', component: () => import('pages/PrijavaAdminaPage.vue') },
      { path: '/prijava/objekt', component: () => import('pages/PrijavaObjektaPage.vue') },
      { path: '/registracija/korisnik', component: () => import('pages/RegistracijaKorisnikaPage.vue') },
      { path: '/registracija/administrator', component: () => import('pages/RegistracijaAdminaPage.vue') },
      { path: '/registracija/objekt', component: () => import('pages/RegistracijaObjektaPage.vue') },
      { path: '/unosJela', component: () => import('pages/UnosJelaPage.vue') },
      { path: '/unosPI', component: () => import('pages/UnosIntolerancijePage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
