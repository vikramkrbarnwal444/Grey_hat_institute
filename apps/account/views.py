from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

# ✅ Register new user
def user_register(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect('register')

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        messages.success(request, "Account created successfully!")
        return redirect('login')

    return render(request, 'account/register.html')  # ✅ fixed template path


# ✅ Login existing user
def user_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            # Pass 'error' message so template shows it properly
            return render(request, 'account/login.html', {'error': 'Invalid username or password'})

    return render(request, 'account/login.html')


# ✅ Logout user
def user_logout(request):
    logout(request)
    return redirect('/')





