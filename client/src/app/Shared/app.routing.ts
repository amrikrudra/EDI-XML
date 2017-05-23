import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from '../master/master.component';
import { LoginComponent } from '../login/login.component';
// Route Configuration
export const routes: Routes = [
    {path:'',component:MasterComponent},
    {path:'login',component:LoginComponent}
    
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);