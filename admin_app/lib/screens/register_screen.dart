import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _auth = FirebaseAuth.instance;
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String password = '';
  String username = '';

  Future<void> registerUser() async {
    if (_formKey.currentState!.validate()) {
      try {
        await _auth.createUserWithEmailAndPassword(
          email: email,
          password: password,
        );
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Đăng ký thành công!')),
        );
        Navigator.pop(context); // Quay lại màn hình Login
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Đăng ký thất bại: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Đăng ký')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Email'),
                onChanged: (value) {
                  email = value;
                },
                validator: (value) =>
                    value!.isEmpty ? 'Hãy nhập email hợp lệ' : null,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Tên tài khoản'),
                onChanged: (value) {
                  username = value;
                },
                validator: (value) =>
                    value!.isEmpty ? 'Hãy nhập tên tài khoản' : null,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Mật khẩu'),
                obscureText: true,
                onChanged: (value) {
                  password = value;
                },
                validator: (value) =>
                    value!.length < 6 ? 'Mật khẩu phải từ 6 ký tự' : null,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: registerUser,
                child: Text('Đăng ký'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
