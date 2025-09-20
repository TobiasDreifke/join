import { Routes } from '@angular/router';
import { Mainpage } from './mainpage/mainpage';
import { Legal } from './legal/legal';
import { Privacy } from './privacy/privacy';
import { Contacts } from './mainpage/contacts/contacts';
import { Component } from '@angular/core';
import { Summary } from './mainpage/summary/summary';
import { Tasks } from './mainpage/tasks/tasks';
import { Board } from './mainpage/board/board';

export const routes: Routes = [
    { path: '', component: Contacts },
    { path: 'legal', component: Legal },
    { path: 'privacy', component: Privacy },
    { path: 'contacts', component: Contacts},
    { path: 'summary', component: Summary },
    { path: 'tasks', component: Tasks},
    { path: 'board', component: Board}
];
