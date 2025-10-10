import { Routes } from '@angular/router';
import { Legal } from './legal/legal';
import { Privacy } from './privacy/privacy';
import { Contacts } from './mainpage/contacts/contacts';
import { Summary } from './mainpage/summary/summary';
import { Tasks } from './mainpage/tasks/tasks';
import { Board } from './mainpage/board/board';
import { Login } from './start-screen/login/login';
import { SignUp } from './start-screen/sign-up/sign-up';

export const routes: Routes = [
    { path: '', redirectTo: '/contacts', pathMatch: 'full'},
    { path: 'legal', component: Legal },
    { path: 'privacy', component: Privacy },
    { path: 'contacts', component: Contacts},
    { path: 'summary', component: Summary },
    { path: 'tasks', component: Tasks},
    { path: 'board', component: Board},
    { path: 'login', component: Login},
    { path: 'sign-up', component: SignUp}
];
