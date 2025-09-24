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
    nameService: 'Lắp đặt hệ thống nước cho nhà vệ sinh',
    rangePrice: 'Khảo sát báo giá',
    Mota: 'Thi công lắp đặt mới hoặc cải tạo hệ thống cấp – thoát nước. Đảm bảo an toàn và bền lâu.',
  },
  {
    key: 'lap_bon_cau_moi',
    nameService: 'Lắp bồn cầu mới',
    rangePrice: '450.000 – 800.000 VND',
    Mota: 'Lắp đặt bồn cầu chắc chắn, không rò rỉ. Đảm bảo vệ sinh và thẩm mỹ.',
  },
  {
    key: 'thay_bon_cau_cu',
    nameService: 'Thay bồn cầu cũ',
    rangePrice: '600.000 – 1.100.000 VND',
    Mota: 'Tháo bồn cầu cũ và lắp mới an toàn, sạch sẽ, không rò rỉ nước.',
  },
  {
    key: 'thay_bo_xa_bon_cau',
    nameService: 'Thay bộ xả bồn cầu',
    rangePrice: '150.000 – 250.000 VND',
    Mota: 'Thay mới bộ xả nhanh chóng, giúp bồn cầu hoạt động trơn tru, tiết kiệm nước.',
  },
  {
    key: 'thay_bo_xa_lavabo',
    nameService: 'Thay bộ xả lavabo',
    rangePrice: '200.000 – 280.000 VND',
    Mota: 'Thay bộ xả lavabo bị hỏng, rò rỉ. Đảm bảo thoát nước nhanh, chống tắc nghẽn.',
  },
  {
    key: 'thao_lap_lavabo',
    nameService: 'Tháo/lắp lavabo',
    rangePrice: '150.000 – 350.000 VND',
    Mota: 'Tháo hoặc lắp lavabo đúng kỹ thuật, chắc chắn, thẩm mỹ và không rò rỉ nước.',
  },
  {
    key: 'thong_nghet_lavabo',
    nameService: 'Thông nghẹt lavabo',
    rangePrice: '400.000 – 850.000 VND',
    Mota: 'Thông tắc lavabo bị nghẹt nhanh chóng, sạch sẽ bằng thiết bị chuyên dụng.',
  },
  {
    key: 'lap_he_thong_nuoc_bep',
    nameService: 'Lắp đặt hệ thống nước cho nhà bếp',
    rangePrice: '1.200.000 – 2.000.000 VND',
    Mota: 'Thi công đường nước, thoát nước và lắp thiết bị bếp. Bố trí gọn gàng, an toàn.',
  },
  {
    key: 'lap_duong_ong_thiet_bi_bep',
    nameService: 'Lắp đường ống và thiết bị rửa nhà bếp',
    rangePrice: '200.000 – 500.000 VND',
    Mota: 'Lắp đặt chậu rửa, vòi nước và đường ống. Đảm bảo chắc chắn, không rò rỉ.',
  },
];
export const ELECTRICITY = [
  {
    key: 'sua_may_giat',
    nameService: 'Sửa máy giặt',
    rangePrice: '230.000 – 245.000 VND',
    Mota: 'Sửa chữa lỗi thường gặp như không vắt, kêu to, báo lỗi, không cấp nước. Thợ sửa nhanh – đúng bệnh.',
  },
  {
    key: 've_sinh_may_giat',
    nameService: 'Vệ sinh máy giặt',
    rangePrice: '350.000 – 650.000 VND',
    Mota: 'Vệ sinh lồng giặt, loại bỏ cặn bẩn, nấm mốc. Giúp quần áo sạch hơn, máy vận hành êm và bền.',
  },
  {
    key: 'thao_lap_may_giat',
    nameService: 'Tháo lắp máy giặt',
    rangePrice: '250.000 – 450.000 VND',
    Mota: 'Tháo lắp, di dời máy giặt an toàn, đúng kỹ thuật. Áp dụng cho lồng đứng, lồng ngang.',
  },
  {
    key: 'sua_may_nuoc_nong',
    nameService: 'Sửa máy tắm nóng',
    rangePrice: '300.000 – 1.400.000 VND',
    Mota: 'Sửa lỗi không nóng, rò điện, báo lỗi. Hỗ trợ cả máy trực tiếp và gián tiếp.',
  },
  {
    key: 'lap_dat_may_nuoc_nong',
    nameService: 'Lắp đặt máy tắm nóng',
    rangePrice: '150.000 – 400.000 VND',
    Mota: 'Thi công lắp đặt máy nước nóng mới, bảo đảm an toàn điện nước, nhanh chóng và gọn gàng.',
  },
  {
    key: 'lap_quat_tran',
    nameService: 'Lắp quạt trần',
    rangePrice: '250.000 – 450.000 VND',
    Mota: 'Lắp đặt quạt trần chắc chắn, cân chỉnh độ cao phù hợp. Đảm bảo vận hành êm và thẩm mỹ.',
  },
  {
    key: 'sua_quat_tran',
    nameService: 'Sửa quạt trần',
    rangePrice: '250.000 – 450.000 VND',
    Mota: 'Khắc phục sự cố quạt quay chậm, kêu to, không điều khiển được. Sửa đúng lỗi, an toàn.',
  },
  {
    key: 'sua_quat_hoi_nuoc',
    nameService: 'Sửa quạt hơi nước',
    rangePrice: '250.000 – 1.450.000 VND',
    Mota: 'Xử lý nhanh các lỗi: không bơm nước, không tạo hơi, kêu to. Thay linh kiện chất lượng.',
  },
  {
    key: 've_sinh_quat_hoi_nuoc',
    nameService: 'Vệ sinh quạt hơi nước',
    rangePrice: '350.000 – 450.000 VND',
    Mota: 'Làm sạch bụi bẩn, rong rêu trong bình chứa. Giúp quạt hoạt động mát, trong lành, an toàn cho sức khỏe.',
  },
];

export const AIR_CONDITIONING = [
  {
    key: 'thao_lap_may_lanh',
    nameService: 'Tháo lắp máy lạnh',
    rangePrice: '200.000 – 500.000 VND',
    Mota: 'Dịch vụ tháo lắp, di dời máy lạnh chuyên nghiệp, đảm bảo đúng kỹ thuật, hỗ trợ tất cả các loại máy lạnh.',
  },
  {
    key: 'sua_may_lanh',
    nameService: 'Sửa máy lạnh',
    rangePrice: '350.000 – 1.300.000 VND',
    Mota: 'Khắc phục các lỗi máy lạnh như không lạnh, chảy nước, phát tiếng ồn, báo lỗi. Thợ chuyên môn sửa nhanh và đúng bệnh.',
  },
  {
    key: 've_sinh_may_lanh',
    nameService: 'Vệ sinh máy lạnh',
    rangePrice: '150.000 – 180.000 VND',
    Mota: 'Làm sạch dàn nóng, dàn lạnh và đường ống, giúp máy lạnh vận hành tốt, tăng hiệu quả làm mát và tiết kiệm điện.',
  },
  {
    key: 'sua_tu_dong',
    nameService: 'Sửa tủ đông',
    rangePrice: '250.000 – 1.650.000 VND',
    Mota: 'Khắc phục nhanh sự cố tủ đông không lạnh, mất nguồn, đóng tuyết. Thay thế linh kiện chính hãng.',
  },
  {
    key: 've_sinh_tu_lanh',
    nameService: 'Vệ sinh tủ lạnh',
    rangePrice: '150.000 – 800.000 VND',
    Mota: 'Vệ sinh, khử mùi, loại bỏ vi khuẩn và nấm mốc. Hỗ trợ nhiều loại tủ: mini, 2 cánh, side by side, multi door.',
  },
];

export const LOCKSMITH = [
  {
    key: 'mo_khoa_cua',
    nameService: 'Mở khóa cửa nhà/phòng/cửa sổ',
    rangePrice: '150.000 – 300.000 VND',
    Mota: 'Hỗ trợ mở khóa khi bị kẹt, mất chìa. Mở nhanh, không phá hỏng ổ khóa.',
  },
  {
    key: 'sua_khoa_cua',
    nameService: 'Sửa khóa cửa nhà/phòng/cửa sổ',
    rangePrice: '100.000 – 250.000 VND',
    Mota: 'Sửa lỗi khóa kẹt, lỏng, chìa không vào được. Đảm bảo an toàn, hoạt động mượt mà.',
  },
  {
    key: 'lap_dat_khoa_cua',
    nameService: 'Lắp đặt khóa cửa mới',
    rangePrice: '200.000 – 500.000 VND',
    Mota: 'Lắp khóa cửa mới an toàn, chắc chắn. Phù hợp nhiều loại cửa: gỗ, sắt, nhôm, kính.',
  },
  {
    key: 'mo_khoa_xe_may',
    nameService: 'Mở khóa xe máy',
    rangePrice: '100.000 – 200.000 VND',
    Mota: 'Mở khóa xe máy khi gãy chìa, kẹt ổ. Hỗ trợ nhanh chóng, an toàn.',
  },
  {
    key: 'sua_khoa_xe_may',
    nameService: 'Sửa khóa xe máy',
    rangePrice: '150.000 – 300.000 VND',
    Mota: 'Khắc phục ổ khóa xe máy kẹt, lỏng, khó khởi động. Vận hành êm và bền.',
  },
  {
    key: 'lap_dat_khoa_xe_may',
    nameService: 'Lắp đặt khóa xe máy',
    rangePrice: '200.000 – 400.000 VND',
    Mota: 'Lắp hoặc thay khóa xe máy mới. Đảm bảo chắc chắn, an toàn chống trộm.',
  },
  {
    key: 'mo_khoa_o_to',
    nameService: 'Mở khóa ô tô',
    rangePrice: '200.000 – 500.000 VND',
    Mota: 'Hỗ trợ mở cửa ô tô khi quên chìa, kẹt khóa. An toàn, không làm hỏng ổ khóa.',
  },
  {
    key: 'sua_khoa_o_to',
    nameService: 'Sửa khóa ô tô',
    rangePrice: '300.000 – 800.000 VND',
    Mota: 'Sửa sự cố khóa ô tô: kẹt, không mở được remote, ổ lỏng. Khắc phục triệt để.',
  },
  {
    key: 'lap_dat_khoa_o_to',
    nameService: 'Lắp đặt khóa ô tô',
    rangePrice: '500.000 – 1.000.000 VND',
    Mota: 'Lắp đặt khóa ô tô mới hoặc khóa thông minh. An toàn, bền bỉ, tiện lợi.',
  },
  {
    key: 'mo_khoa_ket_sat',
    nameService: 'Mở khóa két sắt',
    rangePrice: '300.000 – 1.000.000 VND',
    Mota: 'Mở két sắt khi mất chìa hoặc quên mật khẩu. An toàn, không làm hỏng két.',
  },
  {
    key: 'thay_the_chia_khoa',
    nameService: 'Thay thế chìa khóa',
    rangePrice: '50.000 – 150.000 VND',
    Mota: 'Làm chìa mới khi chìa cũ gãy, mòn hoặc mất. Cắt chìa chính xác, dùng mượt mà.',
  },
  {
    key: 'lam_chia_khoa_moi',
    nameService: 'Làm chìa khóa mới',
    rangePrice: '100.000 – 300.000 VND',
    Mota: 'Nhận làm chìa khóa mới cho cửa nhà, xe máy, ô tô. Cắt chuẩn, bền lâu.',
  },
  {
    key: 'bao_duong_khoa',
    nameService: 'Sửa chữa, bảo dưỡng khóa định kỳ',
    rangePrice: '100.000 – 200.000 VND',
    Mota: 'Bảo dưỡng, tra dầu và sửa chữa nhỏ để khóa vận hành mượt, hạn chế kẹt hoặc gãy chìa.',
  },
];
