// Ordered list of all projects. Display order = array order.
//
// To ADD a project: create content/projects/<id>.json, then add an import
// line and an array entry here (position controls display order).
// To DELETE a project: remove its file, import line, and array entry.
import type { ProjectDetail } from './projects'

import p_telepy from '@/content/projects/telepy.json'
import p_dev_dock_manager_rust from '@/content/projects/dev-dock-manager-rust.json'
import p_morphkit from '@/content/projects/morphkit.json'
import p_stock_trading_simulation from '@/content/projects/stock-trading-simulation.json'
import p_power_trading_ai from '@/content/projects/power-trading-ai.json'
import p_blur_generator from '@/content/projects/blur-generator.json'
import p_heic2png from '@/content/projects/heic2png.json'
import p_batch_crop_images from '@/content/projects/batch-crop-images.json'
import p_nipype_preprocess_on_brain_mr from '@/content/projects/nipype-preprocess-on-brain-mr.json'
import p_solar_prediction_system from '@/content/projects/solar-prediction-system.json'
import p_sentiment_analysis_platform from '@/content/projects/sentiment-analysis-platform.json'
import p_django_project_template from '@/content/projects/django-project-template.json'
import p_django_docker_gui from '@/content/projects/django-docker-gui.json'
import p_dev_dock_manager from '@/content/projects/dev-dock-manager.json'
import p_openpose_detect_hands_with_heatmap from '@/content/projects/openpose-detect-hands-with-heatmap.json'
import p_simply_blur_detector from '@/content/projects/simply-blur-detector.json'
import p_gura_gru_unit_for_recognizing_affect from '@/content/projects/gura-gru-unit-for-recognizing-affect.json'
import p_simply_nlp_classification_labeling_platform from '@/content/projects/simply-nlp-classification-labeling-platform.json'
import p_play_qwop_by_using_ai_agent from '@/content/projects/play-qwop-by-using-ai-agent.json'
import p_elysion_calendar from '@/content/projects/elysion-calendar.json'
import p_ssh_reverse_tunnel_using_docker from '@/content/projects/ssh-reverse-tunnel-using-docker.json'
import p_django_allauth_jwt_template from '@/content/projects/django-allauth-jwt-template.json'
import p_dev_dock from '@/content/projects/dev-dock.json'
import p_ip_find_chrome_extension from '@/content/projects/ip-find-chrome-extension.json'
import p_fisheye_warping from '@/content/projects/fisheye-warping.json'
import p_myanimelist_comment_crawler from '@/content/projects/myanimelist-comment-crawler.json'
import p_simply_labeling_platform_for_machine_reading from '@/content/projects/simply-labeling-platform-for-machine-reading.json'
import p_yande_and_konachan_to_eagle from '@/content/projects/yande-and-konachan-to-eagle.json'
import p_eagle_wrapper from '@/content/projects/eagle-wrapper.json'
import p_youtube_video_redirector from '@/content/projects/youtube-video-redirector.json'
import p_youtube_redirect_player from '@/content/projects/youtube-redirect-player.json'
import p_pyppesnap from '@/content/projects/pyppesnap.json'
import p_face_wall_generator_tool from '@/content/projects/face-wall-generator-tool.json'
import p_image_annotation from '@/content/projects/image-annotation.json'
import p_obsidian_attachmenter from '@/content/projects/obsidian-attachmenter.json'

export const projectsJsonData = [
  p_telepy,
  p_dev_dock_manager_rust,
  p_morphkit,
  p_stock_trading_simulation,
  p_power_trading_ai,
  p_blur_generator,
  p_heic2png,
  p_batch_crop_images,
  p_nipype_preprocess_on_brain_mr,
  p_solar_prediction_system,
  p_sentiment_analysis_platform,
  p_django_project_template,
  p_django_docker_gui,
  p_dev_dock_manager,
  p_openpose_detect_hands_with_heatmap,
  p_simply_blur_detector,
  p_gura_gru_unit_for_recognizing_affect,
  p_simply_nlp_classification_labeling_platform,
  p_play_qwop_by_using_ai_agent,
  p_elysion_calendar,
  p_ssh_reverse_tunnel_using_docker,
  p_django_allauth_jwt_template,
  p_dev_dock,
  p_ip_find_chrome_extension,
  p_fisheye_warping,
  p_myanimelist_comment_crawler,
  p_simply_labeling_platform_for_machine_reading,
  p_yande_and_konachan_to_eagle,
  p_eagle_wrapper,
  p_youtube_video_redirector,
  p_youtube_redirect_player,
  p_pyppesnap,
  p_face_wall_generator_tool,
  p_image_annotation,
  p_obsidian_attachmenter,
] as unknown as ProjectDetail[]
