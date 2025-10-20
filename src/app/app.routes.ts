import { Routes } from '@angular/router';
import { Legal } from './legal/legal';
import { Privacy } from './privacy/privacy';
import { Contacts } from './mainpage/contacts/contacts';
import { Summary } from './mainpage/summary/summary';
import { Tasks } from './mainpage/tasks/tasks';
import { Board } from './mainpage/board/board';
import { Login } from './start-screen/login/login';
import { SignUp } from './start-screen/sign-up/sign-up';
import { HelpPage } from './help-page/help-page';
import { authFunctionalGuard } from './guards/auth-functional-guard';
import { reverseAuthFunctionalGuardGuard } from './guards/reverse-auth-functional-guard-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'legal', component: Legal },
    { path: 'help-page', component: HelpPage },
    { path: 'privacy', component: Privacy },
    { path: 'contacts', component: Contacts, canActivate: [authFunctionalGuard] },
    { path: 'summary', component: Summary, canActivate: [authFunctionalGuard] },
    { path: 'tasks', component: Tasks, canActivate: [authFunctionalGuard] },
    { path: 'board', component: Board, canActivate: [authFunctionalGuard] },
    { path: 'login', component: Login, canActivate: [reverseAuthFunctionalGuardGuard] },
    { path: 'sign-up', component: SignUp, canActivate: [reverseAuthFunctionalGuardGuard] }
];
