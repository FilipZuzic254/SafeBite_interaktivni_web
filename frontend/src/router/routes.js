const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/restorani', component: () => import('pages/SviRestoraniPage.vue') },
      { path: '/kafici', component: () => import('pages/SviKaficiPage.vue') },
      { path: '/prijava/korisnik', component: () => import('pages/PrijavaKorisnikaPage.vue') },
      { path: '/prijava/administrator', component: () => import('pages/PrijavaAdminaPage.vue') },
      { path: '/prijava/vlasnik', component: () => import('src/pages/PrijavaVlasnikaObjektaPage.vue') },
      { path: '/registracija/korisnik', component: () => import('pages/RegistracijaKorisnikaPage.vue') },
      { path: '/registracija/administrator', component: () => import('pages/RegistracijaAdminaPage.vue') },
      { path: '/registracija/vlasnik', component: () => import('src/pages/RegistracijaVlasnikaObjektaPage.vue') },
      { path: '/unosJela', component: () => import('pages/UnosJelaPage.vue') },
      { path: '/unosPI', component: () => import('pages/UnosIntolerancijePage.vue') },
      { path: '/profil', component: () => import('pages/ProfilPage.vue') }
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
