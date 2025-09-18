import { Routes } from '@angular/router';
import { Mainpage } from './mainpage/mainpage';
import { Legal } from './legal/legal';
import { Privacy } from './privacy/privacy';

export const routes: Routes = [
    { path: '', component: Mainpage },
    { path: 'legal', component: Legal },
    { path: 'privacy', component: Privacy }
];
