---
layout: generic
lang: en
title: 联系我们
lead: 有对离子网络（Plasma）的疑问? 在网站上没找到你想要的资源? 联络我们，很快就会恢复你！
date: 2018-08-21 16:26:02
categories:
tags:
---

<div class="container">
  <div class="row">
    <div class="col-sm-12 col-md-8 align-self-center">
      <br><br>
      <form name="contact" method="POST"><input type="hidden" name="form-name" value="contact">
        <div class="form-group">
          <label for="name">你的名字</label>
          <input id="contact-name" name="name" type="text" class="form-control" required autofocus>
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input id="contact-email" name="email" type="email" class="form-control" required="">
        </div>
        <div class="form-group">
          <label for="message">消息内容</label>
          <textarea id="contact-message" name="message" type="text" class="form-control" required=""></textarea>
        </div>
        <input type="submit" value="Send" class="btn btn-primary">
      </form>
      <br><br>
    </div>
  </div>
</div>
