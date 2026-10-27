(function () {
  "use strict";

  var STORAGE_KEY = "store_products_v1";
  var CATEGORIES = ["Women", "Men", "Footwear", "Jewelry", "Sport", "Kids"];

//  Dữ liệu
  function loadProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveProducts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  var products = loadProducts();
  var editingId = null;

  function newId() {
    return "p" + Date.now() + Math.floor(Math.random() * 1000);
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function formatMoney(n) {
    return Number(n || 0).toLocaleString("vi-VN");
  }

//   Giao diện
  var css =
    "#pm-panel{max-width:1200px;margin:30px auto;padding:20px;background:#fff;font-family:Arial,sans-serif;color:#222;border:1px solid #ddd}" +
    "#pm-panel h2{margin:0 0 15px;text-transform:uppercase;letter-spacing:1px}" +
    "#pm-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:15px}" +
    "#pm-form label{display:flex;flex-direction:column;font-size:12px;font-weight:bold;gap:4px}" +
    "#pm-form input,#pm-form select,#pm-form textarea{padding:8px;border:1px solid #bbb;font-size:14px;font-family:inherit}" +
    "#pm-form .pm-actions{display:flex;gap:8px;align-items:flex-end}" +
    ".pm-btn{padding:9px 16px;border:0;cursor:pointer;font-weight:bold;font-size:13px}" +
    ".pm-btn-primary{background:#000;color:#fff}" +
    ".pm-btn-edit{background:#3a7bd5;color:#fff}" +
    ".pm-btn-del{background:#c0392b;color:#fff}" +
    ".pm-btn-cancel{background:#999;color:#fff}" +
    "#pm-toolbar{display:flex;justify-content:space-between;gap:10px;margin:10px 0;flex-wrap:wrap;align-items:center}" +
    "#pm-search{padding:8px;border:1px solid #bbb;min-width:240px}" +
    "#pm-table{width:100%;border-collapse:collapse;font-size:14px}" +
    "#pm-table th,#pm-table td{border:1px solid #ddd;padding:8px;text-align:left;vertical-align:middle}" +
    "#pm-table th{background:#000;color:#fff}" +
    "#pm-table img{width:60px;height:60px;object-fit:cover}" +
    ".pm-low{color:#c0392b;font-weight:bold}" +
    "#pm-empty{text-align:center;padding:20px;color:#777}";

  function buildPanel() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var panel = document.createElement("section");
    panel.id = "pm-panel";
    panel.innerHTML =
      "<h2>Quản lý sản phẩm</h2>" +
      '<form id="pm-form" autocomplete="off">' +
      '<label>Tên sản phẩm *<input type="text" id="pm-name" required maxlength="120"></label>' +
      '<label>Danh mục<select id="pm-category">' +
      CATEGORIES.map(function (c) {
        return '<option value="' + c + '">' + c + "</option>";
      }).join("") +
      "</select></label>" +
      '<label>Giá (VNĐ) *<input type="number" id="pm-price" min="0" step="1000" required></label>' +
      '<label>Số lượng tồn *<input type="number" id="pm-qty" min="0" step="1" required></label>' +
      '<label>Link ảnh<input type="url" id="pm-image" placeholder="https://..."></label>' +
      '<label>Ghi chú<input type="text" id="pm-note" maxlength="200"></label>' +
      '<div class="pm-actions">' +
      '<button type="submit" class="pm-btn pm-btn-primary" id="pm-submit">Thêm sản phẩm</button>' +
      '<button type="button" class="pm-btn pm-btn-cancel" id="pm-cancel" style="display:none">Hủy</button>' +
      "</div></form>" +
      '<div id="pm-toolbar">' +
      '<input type="search" id="pm-search" placeholder="Tìm theo tên hoặc danh mục...">' +
      '<span id="pm-summary"></span></div>' +
      '<table id="pm-table"><thead><tr>' +
      "<th>#</th><th>Ảnh</th><th>Tên</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Ghi chú</th><th>Thao tác</th>" +
      '</tr></thead><tbody id="pm-body"></tbody></table>' +
      '<div id="pm-empty" style="display:none">Chưa có sản phẩm nào.</div>';

    document.body.appendChild(panel);

    document.getElementById("pm-form").addEventListener("submit", onSubmit);
    document.getElementById("pm-cancel").addEventListener("click", resetForm);
    document.getElementById("pm-search").addEventListener("input", render);
    document.getElementById("pm-body").addEventListener("click", onTableClick);
  }

//   Hiển thị danh sách
  function render() {
    var keyword = document
      .getElementById("pm-search")
      .value.trim()
      .toLowerCase();
    var list = products.filter(function (p) {
      return (
        !keyword ||
        p.name.toLowerCase().indexOf(keyword) !== -1 ||
        p.category.toLowerCase().indexOf(keyword) !== -1
      );
    });

    var body = document.getElementById("pm-body");
    body.innerHTML = list
      .map(function (p, i) {
        var img = p.image
          ? '<img src="' +
            escapeHtml(p.image) +
            '" alt="" onerror="this.style.display=\'none\'">'
          : "—";
        var qtyClass = p.qty <= 5 ? "pm-low" : "";
        return (
          "<tr>" +
          "<td>" +
          (i + 1) +
          "</td>" +
          "<td>" +
          img +
          "</td>" +
          "<td>" +
          escapeHtml(p.name) +
          "</td>" +
          "<td>" +
          escapeHtml(p.category) +
          "</td>" +
          "<td>" +
          formatMoney(p.price) +
          " đ</td>" +
          '<td class="' +
          qtyClass +
          '">' +
          p.qty +
          "</td>" +
          "<td>" +
          escapeHtml(p.note) +
          "</td>" +
          "<td>" +
          '<button class="pm-btn pm-btn-edit" data-action="edit" data-id="' +
          p.id +
          '">Sửa</button> ' +
          '<button class="pm-btn pm-btn-del" data-action="delete" data-id="' +
          p.id +
          '">Xóa</button>' +
          "</td></tr>"
        );
      })
      .join("");

    document.getElementById("pm-empty").style.display = list.length
      ? "none"
      : "block";

    var totalQty = products.reduce(function (s, p) {
      return s + p.qty;
    }, 0);
    var totalValue = products.reduce(function (s, p) {
      return s + p.qty * p.price;
    }, 0);
    document.getElementById("pm-summary").textContent =
      products.length +
      " sản phẩm | Tổng tồn: " +
      totalQty +
      " | Giá trị kho: " +
      formatMoney(totalValue) +
      " đ";
  }

//  Thêm/ Sửa
  function onSubmit(e) {
    e.preventDefault();

    var data = {
      name: document.getElementById("pm-name").value.trim(),
      category: document.getElementById("pm-category").value,
      price: Number(document.getElementById("pm-price").value),
      qty: parseInt(document.getElementById("pm-qty").value, 10),
      image: document.getElementById("pm-image").value.trim(),
      note: document.getElementById("pm-note").value.trim(),
    };

    if (!data.name) {
      alert("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (isNaN(data.price) || data.price < 0) {
      alert("Giá không hợp lệ.");
      return;
    }
    if (isNaN(data.qty) || data.qty < 0) {
      alert("Số lượng không hợp lệ.");
      return;
    }

    if (editingId) {
      products = products.map(function (p) {
        return p.id === editingId ? Object.assign({}, p, data) : p;
      });
    } else {
      data.id = newId();
      products.push(data);
    }

    saveProducts(products);
    resetForm();
    render();
  }

  function startEdit(id) {
    var p = products.filter(function (x) {
      return x.id === id;
    })[0];
    if (!p) return;

    editingId = id;
    document.getElementById("pm-name").value = p.name;
    document.getElementById("pm-category").value = p.category;
    document.getElementById("pm-price").value = p.price;
    document.getElementById("pm-qty").value = p.qty;
    document.getElementById("pm-image").value = p.image;
    document.getElementById("pm-note").value = p.note;
    document.getElementById("pm-submit").textContent = "Lưu thay đổi";
    document.getElementById("pm-cancel").style.display = "inline-block";
    document.getElementById("pm-panel").scrollIntoView({ behavior: "smooth" });
    document.getElementById("pm-name").focus();
  }

  function resetForm() {
    editingId = null;
    document.getElementById("pm-form").reset();
    document.getElementById("pm-submit").textContent = "Thêm sản phẩm";
    document.getElementById("pm-cancel").style.display = "none";
  }

//  Xóa
  function deleteProduct(id) {
    var p = products.filter(function (x) {
      return x.id === id;
    })[0];
    if (!p) return;
    if (!confirm('Bạn có chắc muốn xóa "' + p.name + '"?')) return;

    products = products.filter(function (x) {
      return x.id !== id;
    });
    saveProducts(products);
    if (editingId === id) resetForm();
    render();
  }

  function onTableClick(e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    if (btn.getAttribute("data-action") === "edit") startEdit(id);
    if (btn.getAttribute("data-action") === "delete") deleteProduct(id);
  }

//   Khởi động
  function init() {
    buildPanel();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
