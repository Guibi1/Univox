<div class="overflow-hidden bg-gray-700">
    <a class="active" href="#home">Home</a>
    <a href="#news">News</a>
    <a href="#contact">Contact</a>
    <a href="#about">About</a>
  </div> 

  <style>
    div a {
        float: left;
        color: #f2f2f2;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 17px;
    }

    div a:hover {
        background-color: #ddd;
        color: black
    }

    div a.active {
        background-color: #04AA6D;
        color: white;
    }

  </style>

<slot></slot>
