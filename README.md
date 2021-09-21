# 怎么用

**Node启动如下：**  
```shell
yarn
# 时间单位都为 秒/s
yarn node:start [id] [password] [id] [password] [id] [password] ...
# or
yarn start [页面超时时间] [加载等待时间] [id] [password] [id] [password] [id] [password] ...
```

**Github Action启动如下：**
```yaml
# fork项目，找到.github/workflows/autoClocked.yml并修改命令行，这里的secrets配置不懂可以看下面的网址
# https://stackoverflow.com/questions/67964110/how-to-access-secrets-when-using-flutter-web-with-github-actions/67998780#67998780
- name: Run script
      run: npm run start 0 30 ${{ secrets.USERID }} ${{ secrets.PASSWORD }}
```

## 关于构建失败
服务器容易摆烂，可以适当延长超时时间，修改 `[页面超时时间=无限] [加载等待时间=30s]` 