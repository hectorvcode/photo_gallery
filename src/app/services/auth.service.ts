import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  updatePassword
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private auth: Auth) {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Registro con email y contraseña
  register(email: string, password: string, displayName?: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        async (result) => {
          // Actualizar el perfil con el nombre si se proporciona
          if (displayName && result.user) {
            await updateProfile(result.user, { displayName });
          }
          return result;
        }
      )
    );
  }

  // Iniciar sesión con email y contraseña
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Cerrar sesión
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Obtener datos del usuario actual como observable
  getCurrentUserData(): Observable<UserData | null> {
    return this.currentUser$.pipe(
      map(user => {
        if (!user) return null;
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        };
      })
    );
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Enviar email de verificación
  sendEmailVerification(): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return from(sendEmailVerification(user));
  }

  // Restablecer contraseña
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  // Actualizar perfil del usuario
  updateUserProfile(displayName?: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return from(updateProfile(user, { displayName }));
  }

  // Cambiar contraseña
  changePassword(newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return from(updatePassword(user, newPassword));
  }

  // Eliminar cuenta
  deleteAccount(): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return from(deleteUser(user));
  }

  // Recargar usuario (útil después de verificación de email)
  reloadUser(): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return from(user.reload());
  }
}