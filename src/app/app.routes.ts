import { Routes } from '@angular/router';
import { Legal } from './legal/legal';
import { Privacy } from './privacy/privacy';
import { Contacts } from './mainpage/contacts/contacts';
import { Summary } from './mainpage/summary/summary';
import { Tasks } from './mainpage/tasks/tasks';
import { Board } from './mainpage/board/board';
import { Login } from './start-screen/login/login';
import { SignUp } from './start-screen/sign-up/sign-up';
import { authFunctionalGuard } from './guards/auth-functional-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/contacts', pathMatch: 'full' },
    { path: 'legal', component: Legal },
    { path: 'privacy', component: Privacy },
    { path: 'contacts', component: Contacts, canActivate: [authFunctionalGuard] },
    { path: 'summary', component: Summary, canActivate: [authFunctionalGuard] },
    { path: 'tasks', component: Tasks, canActivate: [authFunctionalGuard] },
    { path: 'board', component: Board, canActivate: [authFunctionalGuard] },
    { path: 'login', component: Login },
    { path: 'sign-up', component: SignUp }
];
