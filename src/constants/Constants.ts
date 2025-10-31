export const REQUIRED_DOCUMENTS = [
  {
    id: 'identity_chip',
    label: 'CCCD gắn chip',
    navigationTo: 'IdentityChipView',
  },
  {
    id: 'owner_verification',
    label: 'Thông tin sim chính chủ',
    navigationTo: 'OwnerVerificationView',
  },
  {
    id: 'judicial_record',
    label: 'Lý lịch tư pháp',
    navigationTo: 'JudicialRecordView',
  },
];

export const GENDER = [
  { key: 'male', name: 'Nam' },
  { key: 'female', name: 'Nữ' },
];

export const ELECTRICITY_WATER = [
  {
    key: 'lap_he_thong_nuoc_wc',
    nameService: 'Lắp đặt hệ thống nước nhà vệ sinh',
    rangePrice: 'Khảo sát báo giá',
    Mota: 'Thi công đường nước, thoát nước, lắp vòi, xả và thiết bị trong nhà vệ sinh. Yêu cầu khảo sát thực tế để báo giá chính xác.',
  },
  {
    key: 'lap_bon_cau_moi',
    nameService: 'Lắp đặt bồn cầu mới',
    rangePrice: '450.000 – 800.000 VND',
    Mota: 'Thợ lắp đặt bồn cầu mới, cố định chắc chắn, trét keo chống rò nước, kiểm tra xả trước khi bàn giao.',
  },
  {
    key: 'thay_bon_cau_cu',
    nameService: 'Thay thế bồn cầu cũ',
    rangePrice: '600.000 – 1.100.000 VND',
    Mota: 'Tháo bồn cầu cũ, lắp bồn mới, xử lý ron nước, kiểm tra thoát nước kín, không rò rỉ.',
  },
  {
    key: 'thay_bo_xa_bon_cau',
    nameService: 'Thay bộ xả bồn cầu',
    rangePrice: '150.000 – 250.000 VND',
    Mota: 'Thay mới bộ xả, phao nước hoặc van xả bị hư, chỉnh mức nước và kiểm tra rò rỉ.',
  },
  {
    key: 've_sinh_bon_cau',
    nameService: 'Vệ sinh bồn cầu',
    rangePrice: '120.000 – 250.000 VND',
    Mota: 'Làm sạch ố vàng, cặn nước, khử mùi và xử lý bồn cầu xả yếu. Dùng dung dịch chuyên dụng, không trầy men.',
  },
  {
    key: 've_sinh_lavabo',
    nameService: 'Vệ sinh lavabo',
    rangePrice: '100.000 – 200.000 VND',
    Mota: 'Làm sạch bồn rửa mặt, xử lý nghẹt nhẹ, đánh bóng và khử mùi đường thoát nước.',
  },
  {
    key: 'thong_nghet_lavabo',
    nameService: 'Thông nghẹt lavabo',
    rangePrice: '350.000 – 650.000 VND',
    Mota: 'Dùng dụng cụ thông chuyên dụng xử lý nghẹt ống xả lavabo, bảo đảm thông thoát hoàn toàn, không gây hư hỏng.',
  },
  {
    key: 'lap_may_nuoc_nong_lanh',
    nameService: 'Lắp máy nước nóng lạnh lavabo',
    rangePrice: '250.000 – 400.000 VND',
    Mota: 'Lắp vòi nước nóng lạnh, nối ống nước, siết khớp kín, kiểm tra áp lực nước và rò rỉ.',
  },
  {
    key: 'lap_he_thong_nuoc_bep',
    nameService: 'Lắp hệ thống nước cho bếp',
    rangePrice: '1.000.000 – 2.000.000 VND',
    Mota: 'Thi công đường ống cấp, thoát nước và thiết bị bếp (chậu rửa, vòi, ống dẫn...). Làm gọn, kín và chắc chắn.',
  },
  {
    key: 'thong_nghet_bon_rua',
    nameService: 'Thông nghẹt bồn rửa chén',
    rangePrice: '350.000 – 800.000 VND',
    Mota: 'Thông tắc ống thoát nước bếp do dầu mỡ hoặc rác thải, kiểm tra thoát nước ổn định.',
  },
  {
    key: 'lap_binh_nuoc_nong',
    nameService: 'Lắp đặt bình nước nóng',
    rangePrice: '250.000 – 500.000 VND',
    Mota: 'Lắp đặt bình nước nóng treo tường hoặc ngang. Khoan, bắt giá đỡ, đấu điện và test rò điện trước khi bàn giao.',
  },
];

export const ELECTRICITY = [
  {
    key: 'sua_may_giat',
    nameService: 'Sửa máy giặt',
    rangePrice: '250.000 – 600.000 VND',
    Mota: 'Kiểm tra, khắc phục lỗi máy giặt không vắt, không cấp nước, báo lỗi, rung mạnh. Có thể thay linh kiện nếu cần.',
  },
  {
    key: 've_sinh_may_giat',
    nameService: 'Vệ sinh máy giặt',
    rangePrice: '300.000 – 500.000 VND',
    Mota: 'Tháo lồng giặt, vệ sinh sạch cặn bẩn, rong rêu và nấm mốc. Lắp lại, test chạy êm và sạch.',
  },
  {
    key: 'thao_lap_may_giat',
    nameService: 'Tháo/lắp máy giặt',
    rangePrice: '250.000 – 450.000 VND',
    Mota: 'Hỗ trợ tháo/lắp khi di chuyển hoặc lắp máy mới. Cố định ống nước, cân máy chắc chắn.',
  },
  {
    key: 'lap_quat_tran',
    nameService: 'Lắp đặt quạt trần',
    rangePrice: '250.000 – 450.000 VND',
    Mota: 'Lắp quạt trần, đấu dây an toàn, cân cánh quạt, kiểm tra rung lắc và tiếng ồn.',
  },
  {
    key: 'sua_quat_dien',
    nameService: 'Sửa quạt điện',
    rangePrice: '150.000 – 300.000 VND',
    Mota: 'Sửa quạt quay yếu, không quay, kêu to, thay tụ hoặc motor nếu cần.',
  },
  {
    key: 've_sinh_quat_dien',
    nameService: 'Vệ sinh quạt điện',
    rangePrice: '80.000 – 150.000 VND',
    Mota: 'Tháo lồng, cánh quạt, lau sạch bụi, tra dầu trục quay giúp quạt chạy êm và mát hơn.',
  },
  {
    key: 'lap_bong_den',
    nameService: 'Lắp/thay bóng đèn',
    rangePrice: '50.000 – 100.000 VND',
    Mota: 'Thay hoặc lắp mới bóng đèn LED, đèn huỳnh quang, kiểm tra dây điện và công tắc.',
  },
  {
    key: 'lap_cong_tac_o_cam',
    nameService: 'Lắp ổ cắm/công tắc điện',
    rangePrice: '80.000 – 200.000 VND',
    Mota: 'Thay mới hoặc lắp ổ cắm, công tắc, đấu dây an toàn, kiểm tra nguồn trước khi bàn giao.',
  },
];

export const AIR_CONDITIONING = [
  {
    key: 'lap_dat_may_lanh',
    nameService: 'Lắp đặt máy lạnh',
    rangePrice: '350.000 – 600.000 VND',
    Mota: 'Khoan tường, lắp dàn lạnh/dàn nóng, hút chân không, nạp gas và test lạnh trước khi bàn giao.',
  },
  {
    key: 'sua_may_lanh',
    nameService: 'Sửa máy lạnh',
    rangePrice: '300.000 – 1.000.000 VND',
    Mota: 'Kiểm tra lỗi không lạnh, chảy nước, kêu to, rò gas, sửa block, bo mạch hoặc quạt.',
  },
  {
    key: 've_sinh_may_lanh',
    nameService: 'Vệ sinh máy lạnh',
    rangePrice: '150.000 – 250.000 VND',
    Mota: 'Vệ sinh dàn lạnh, dàn nóng, xịt rửa, khử mùi và kiểm tra gas, ống thoát nước, test lại hoạt động.',
  },
  {
    key: 'sua_tu_lanh',
    nameService: 'Sửa tủ lạnh',
    rangePrice: '250.000 – 800.000 VND',
    Mota: 'Khắc phục tủ lạnh không lạnh, kém lạnh, đóng tuyết, rò điện, hư cảm biến hoặc quạt.',
  },
  {
    key: 've_sinh_tu_lanh',
    nameService: 'Vệ sinh tủ lạnh',
    rangePrice: '200.000 – 400.000 VND',
    Mota: 'Lau chùi trong ngoài, khử mùi, làm sạch ron cửa, khay chứa nước và kiểm tra quạt gió.',
  },
  {
    key: 've_sinh_may_hut_mui',
    nameService: 'Vệ sinh máy hút mùi bếp',
    rangePrice: '200.000 – 350.000 VND',
    Mota: 'Tháo lưới lọc, lau dầu mỡ, làm sạch quạt hút và khử mùi. Giúp máy hút mạnh và giảm tiếng ồn.',
  },
];

export const LOCKSMITH = [
  {
    key: 'mo_khoa_cua',
    nameService: 'Mở khóa cửa nhà/phòng',
    rangePrice: '150.000 – 300.000 VND',
    Mota: 'Mở cửa khi mất chìa hoặc khóa bị kẹt. Dùng dụng cụ mở không phá ổ, thao tác nhanh và an toàn.',
  },
  {
    key: 'sua_khoa_cua',
    nameService: 'Sửa khóa cửa',
    rangePrice: '100.000 – 250.000 VND',
    Mota: 'Khóa kẹt, lỏng hoặc không tra được chìa. Tra dầu, chỉnh then hoặc thay bi ổ khóa.',
  },
  {
    key: 'lap_dat_khoa_cua',
    nameService: 'Lắp khóa cửa mới',
    rangePrice: '200.000 – 500.000 VND',
    Mota: 'Khoan lỗ, bắt ổ, lắp khóa cơ, điện tử hoặc thông minh. Căn chỉnh then nhẹ, đóng mở êm.',
  },
  {
    key: 've_sinh_o_khoa',
    nameService: 'Vệ sinh & bảo dưỡng ổ khóa',
    rangePrice: '80.000 – 150.000 VND',
    Mota: 'Làm sạch bụi, tra dầu mỡ và chỉnh lò xo để khóa hoạt động trơn tru, tránh kẹt ổ.',
  },
  {
    key: 'mo_khoa_xe_may',
    nameService: 'Mở khóa xe máy',
    rangePrice: '100.000 – 200.000 VND',
    Mota: 'Mở khóa khi kẹt ổ, gãy chìa. Không làm hư ổ, hỗ trợ tận nơi nhanh chóng.',
  },
  {
    key: 'sua_khoa_xe_may',
    nameService: 'Sửa khóa xe máy',
    rangePrice: '150.000 – 300.000 VND',
    Mota: 'Khóa xe lỏng, kẹt, không xoay được. Tháo kiểm tra, thay bi hoặc lò xo, vệ sinh lại ổ.',
  },
  {
    key: 'lam_chia_khoa',
    nameService: 'Làm chìa khóa mới',
    rangePrice: '100.000 – 250.000 VND',
    Mota: 'Cắt chìa mới cho cửa, xe máy hoặc ô tô. Đảm bảo tra ổ nhẹ, không sượng.',
  },
  {
    key: 'mo_khoa_ket_sat',
    nameService: 'Mở khóa két sắt',
    rangePrice: '300.000 – 1.000.000 VND',
    Mota: 'Mở két khi mất chìa hoặc quên mật khẩu. Dụng cụ chuyên dụng, an toàn tài sản.',
  },
];
