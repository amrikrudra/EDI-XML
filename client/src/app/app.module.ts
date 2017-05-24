import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MasterComponent } from './master/master.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { SettingdModule } from './setting/setting.module';

import { UserModule } from './user/user.module';
import { FreightModule } from './freight/freight.module';
import { DailyTranModule } from './dailytran/dailytran.module';
import { XmlLogModule } from './xmllog/xmllog.module';
import { CountryModule } from './country/country.module';

@NgModule({
  declarations: [
        AppComponent,
        LoginComponent,      
        MasterComponent
  ],
  imports: [
    BrowserModule,
   
    DashboardModule,
    SettingdModule,
    FormsModule,
    UserModule,
    FreightModule,
    DailyTranModule,
    XmlLogModule,
    CountryModule,
    HttpModule,
    RouterModule.forRoot([ 
    
     
    ]),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
