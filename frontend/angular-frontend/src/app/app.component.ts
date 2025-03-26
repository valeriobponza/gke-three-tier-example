import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { RestServiceService } from './rest-service.service';
import { NgClass, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Todo } from './model/todo';
import { environment } from '../environments/environment';

const BASE_API = environment.apiUrl;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  todos = signal<Todo[]>([]);
  error = signal(false);

  totalCompleted = computed(
    () => this.todos().filter((t) => t.completed).length
  );

  totalTodos = computed(() => this.todos().filter((t) => !t.completed).length);

  ngOnInit() {
    this.http.get<Todo[]>(`${BASE_API}/todos`).subscribe({
      next: (res) => {
        this.todos.set(res);
      },
      error: (err) => {
        console.log('here', err);
        this.error.set(true);
      },
    });
  }

  addTodo(input: HTMLInputElement) {
    this.error.set(false);
    this.http
      .post<Todo>(`${BASE_API}/todos`, {
        title: input.value,
        completed: false,
      })
      .subscribe({
        next: (newTodo) => {
          this.http.get<Todo[]>(`${BASE_API}/todos`).subscribe({
            next: (res) => {
              this.todos.set(res);
            },
            error: (err) => {
              console.log('here', err);
              this.error.set(true);
            },
          });
          input.value = '';
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  removeTodo(todoToRemove: Todo) {
    this.error.set(false);
    this.http.delete(`${BASE_API}/todos/${todoToRemove.id}`).subscribe({
      next: () => {
        this.todos.update((todos) =>
          todos.filter((todo) => todo.id !== todoToRemove.id)
        );
      },
      error: () => {
        this.error.set(true);
      },
    });
  }

  toggleTodo(todoToToggle: Todo) {
    this.error.set(false);
    this.http
      .patch<Todo>(`${BASE_API}/todos/${todoToToggle.id}`, {
        completed: !todoToToggle.completed,
      })
      .subscribe({
        next: (res) => {
          this.todos.update((todos) => {
            return todos.map((t) => {
              if (t.id === todoToToggle.id)
                t.completed = !t.completed
              return t
            });
          });
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

}

