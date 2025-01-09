import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Quản lý vân tay')),
      body: Center(
        child: Text('Chào mừng đến với màn hình quản lý!'),
      ),
    );
  }
}
